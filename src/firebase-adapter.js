// Making the Merge website: gives the game the same small storage interface it uses inside Claude
// (claude.use('db' | 'user' | 'assets')), backed by Firebase Auth (Google sign-in) and Cloud Firestore.
// With no Firebase config filled in, every capability resolves to null and the game saves on the device.
(function () {
  const cfg = window.FIREBASE_CONFIG || {};
  const configured = !!(cfg.apiKey && cfg.projectId && window.firebase);
  let auth = null, fs = null, current = null, ownerCache = null;

  const authReady = new Promise(resolve => {
    if (!configured) return resolve(null);
    try {
      firebase.initializeApp(cfg);
      auth = firebase.auth();
      fs = firebase.firestore();
      let first = true;
      auth.onAuthStateChanged(u => {
        const changed = !first && (u ? u.uid : null) !== (current ? current.uid : null);
        current = u;
        if (first) { first = false; resolve(u); }
        else if (changed) location.reload(); // signing in or out restarts the game with the right save
      });
    } catch (e) { console.warn('Firebase could not start', e); resolve(null); }
  });

  // Map Firestore errors onto the codes the game already understands.
  const mapErr = e => {
    const c = e && e.code;
    if (c === 'permission-denied') return { code: 'not_granted', message: e.message };
    if (c === 'invalid-argument') return { code: 'invalid_argument', message: e.message };
    if (c === 'resource-exhausted') return { code: 'resource_exhausted', message: e.message };
    return { code: 'unavailable', message: (e && e.message) || 'unavailable' };
  };
  const snapDoc = s => ({ id: s.id, exists: s.exists, data: () => s.data(), metadata: { fromCache: s.metadata.fromCache, hasPendingWrites: s.metadata.hasPendingWrites } });
  const snapQuery = q => ({ size: q.size, empty: q.empty, docs: q.docs.map(snapDoc), metadata: { fromCache: q.metadata.fromCache, hasPendingWrites: q.metadata.hasPendingWrites } });

  function docRef(path) {
    const r = fs.doc(path);
    return {
      id: r.id, path,
      get: () => r.get().then(snapDoc, e => Promise.reject(mapErr(e))),
      set: data => r.set(data).catch(e => Promise.reject(mapErr(e))),
      update: data => r.update(data).catch(e => Promise.reject(mapErr(e))),
      delete: () => r.delete().catch(e => Promise.reject(mapErr(e))),
      onSnapshot: (next, err) => r.onSnapshot(s => next(snapDoc(s)), e => err && err(mapErr(e))),
      collection: sub => collRef(path + '/' + sub)
    };
  }
  function collRef(path) {
    const r = fs.collection(path);
    return {
      path,
      doc: id => docRef(id ? path + '/' + id : r.doc().path),
      get: () => r.get().then(snapQuery, e => Promise.reject(mapErr(e))),
      onSnapshot: (next, err) => r.onSnapshot(q => next(snapQuery(q)), e => err && err(mapErr(e)))
    };
  }
  const db = { doc: docRef, collection: collRef };

  // The owner is whoever the security rules allow to claim config/owner (set by email in the Firebase console).
  async function isOwner() {
    if (ownerCache !== null) return ownerCache;
    const u = await authReady;
    if (!u) return (ownerCache = false);
    try {
      const ref = fs.doc('config/owner'), s = await ref.get();
      if (s.exists) return (ownerCache = s.data().uid === u.uid);
      await ref.set({ uid: u.uid });           // only succeeds for the owner's email
      return (ownerCache = true);
    } catch (e) { return (ownerCache = false); }
  }

  const user = {
    id: async () => { const u = await authReady; return u ? u.uid : null; },
    isOwner, canEdit: isOwner,
    can: async () => null,
    me: async () => { const u = await authReady; return { id: u ? u.uid : null, name: u ? u.displayName || '' : '', email: u ? u.email : null, isOwner: await isOwner(), canEdit: await isOwner() }; }
  };

  // Uploaded art is kept as a phone-sized copy in Firestore by the game itself, so "upload" just hands back an id.
  const assets = {
    upload: async blob => ({ id: 'up' + Date.now().toString(36) + Math.random().toString(36).slice(2, 10), url: URL.createObjectURL(blob), sizeBytes: blob.size, contentType: blob.type }),
    delete: async () => ({ deleted: true }),
    list: async () => ({ assets: [], usage: {} })
  };

  window.MTM_AUTH = {
    configured,
    user: () => current,
    signIn: async () => {
      if (!configured) throw new Error('Sign-in is not set up yet.');
      const provider = new firebase.auth.GoogleAuthProvider();
      try { await auth.signInWithPopup(provider); }
      catch (e) {
        if (e && (e.code === 'auth/popup-blocked' || e.code === 'auth/operation-not-supported-in-this-environment')) return auth.signInWithRedirect(provider);
        if (e && e.code === 'auth/popup-closed-by-user') return;
        throw e;
      }
    },
    signOut: () => auth && auth.signOut()
  };

  window.claude = {
    use: async name => {
      if (!configured) return null;
      await authReady;
      if (name === 'db') return db;
      if (name === 'user') return user;
      if (name === 'assets') return (await isOwner()) ? assets : null;
      return null;
    }
  };
})();

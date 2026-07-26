useEffect(() => {
    const auth = localStorage.getItem('hutri-admin-auth');
    if (auth === 'true') {
      setIsAuth(true);
    }

    const params = new URLSearchParams(window.location.search);
    const adminValue = params.get('admin');
    
    // Hanya mengizinkan admin81 dan panitia81
    const allowed = ['admin81', 'panitia81'];

    if (adminValue && allowed.includes(adminValue.toLowerCase())) {
      setIsAuth(true);
      localStorage.setItem('hutri-admin-auth', 'true');
      window.history.replaceState({}, document.title, `${window.location.pathname}?admin`);
    } else if (params.has('admin') && !adminValue) {
      setIsAuth(true);
      localStorage.setItem('hutri-admin-auth', 'true');
    }

    fetchDataFromCloud();

    const channel = supabase
      .channel('public:admin_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'pendaftar' },
        () => fetchDataFromCloud()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'donasi' },
        () => fetchDataFromCloud()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Batasi password yang valid hanya 2 opsi ini
    const allowed = ['admin81', 'panitia81'];
    
    if (allowed.includes(password.toLowerCase())) {
      setIsAuth(true);
      localStorage.setItem('hutri-admin-auth', 'true');
    } else {
      alert('Password salah! Gunakan password yang sah.');
    }
  };

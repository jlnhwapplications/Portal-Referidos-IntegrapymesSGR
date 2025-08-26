// ** React Imports
import { createContext, useEffect, useState } from 'react'
import { UrlApi } from "../keys";
// ** Next Import
import { useRouter } from 'next/router'
import { auth, firestore, firebase, storage, provider } from '../configs/firebaseConfig'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import { doc, collection, addDoc, query, where, getDocs, updateDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { sendPasswordResetEmail } from 'firebase/auth';
import { loginToken } from '@/redux/token'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast';
import axios from 'axios';
import { dataEncrpt } from '@/@core/utils/data-encrypt';
import { obtenerMisReferidos } from '@/redux/Cuenta';
// ** Defaults
const defaultProvider = {
  user: null,
  loading: true,
  loadingReferidos: true,
  loadingAuth: true,
  setUser: () => null,
  setLoading: () => Boolean,
  setLoadingReferidos: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  referido: null,
  retrieveReferidos: false,
  referidos: []
}
const AuthContext = createContext(defaultProvider)

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch()
  const tokenSelector = useSelector(store => store.token.token)
  // ** States
  const [user, setUser] = useState(defaultProvider.user)
  const [loading, setLoading] = useState(defaultProvider.loading)
  const [loadingReferidos, setLoadingReferidos] = useState(defaultProvider.loadingReferidos)
  const [token, setToken] = useState('')
  const [referido, setReferido] = useState({});
  const [referidos, setReferidos] = useState([]);
  const [retrieveReferidos, setRetrieveReferidos] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(false);
  // ** Hooks
  const router = useRouter()

  useEffect(() => {
    if (Object.keys(tokenSelector).length !== 0) {
      setToken(tokenSelector.token)
    }
  }, [tokenSelector])

  useEffect(() => {
    dispatch(loginToken());
  }, []);


  useEffect(() => {
    if (window.localStorage.getItem("referido") != null) {
      let referido = JSON.parse(window.localStorage.getItem("referido"))
      setReferido(referido);
    }
  }, [])

  useEffect(() => {
    if (user && token) {
      setLoadingReferidos(true)
      dispatch(obtenerMisReferidos(user?.accountid, token))
        .then(data => {
          if (data?.length > 0) {
            setReferidos(data)
            setRetrieveReferidos(true)
            setLoadingReferidos(false)
          } else {
            setReferidos([])
            setRetrieveReferidos(true)
            setLoadingReferidos(false)
          }
        })
        .catch(() => {
          setReferidos([])
          setLoadingReferidos(false)
        })
    }
  }, [user, token]);

  const RefrescarReferidos = () => {
    if (user && token) {
      setLoadingReferidos(true)
      dispatch(obtenerMisReferidos(user?.accountid, token))
        .then(data => {
          if (data?.length > 0) {
            setReferidos(data)
            setRetrieveReferidos(true)
            setLoadingReferidos(false)
          } else {
            setReferidos([])
            setRetrieveReferidos(true)
            setLoadingReferidos(false)
          }
        })
        .catch(() => {
          setReferidos([])
          setLoadingReferidos(false)
        })
    }
  }

  useEffect(() => {
    let refreshInterval;

    const refreshToken = () => {
      dispatch(loginToken());
    };

    const startRefreshTimer = () => {
      refreshInterval = setInterval(refreshToken, 1800000); // Llamada cada 30 minutos
    };

    const stopRefreshTimer = () => {
      clearInterval(refreshInterval);
    };

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        let accountID = ""
        const uid = currentUser.uid;

        // Obtener el documento del usuario desde Firestore
        const usuariosCollection = collection(firestore, 'usuarios'); // Acceder a la colección
        const usuarioDoc = query(usuariosCollection, where('uid', '==', uid)); // Crear una consulta

        const querySnapshot = await getDocs(usuarioDoc);

        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          const { correo, accountid, nombreUsuario, uid, photoURL, photoPORTADA, Estado } = userData;
          accountID = accountid
          setUser({
            correo,
            accountid,
            nombreUsuario,
            uid,
            photoURL,
            photoPORTADA,
            Estado
          });
        }
        dispatch(loginToken());
        //   .then(() =>{
        //     obtenerReferidores(accountID, token)
        // }) // Dispatch de logintoken() para obtener el token
        startRefreshTimer(); // Inicia el temporizador de actualización 
      } else {
        setUser(null);
        setToken(null);
        stopRefreshTimer(); // Detiene el temporizador de actualización si el usuario no está autenticado
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const actualizarMiPerfil = async () => {
    if (user && token) {
      setLoadingReferidos(true)
      await dispatch(obtenerMisReferidos(user?.accountid, token))
        .then(data => {
          if (data?.length > 0) {
            setReferidos(data)
            let referidoActualizado = data.filter(item => item.accountid == referido.accountid)
            if (referidoActualizado?.length > 0) {
              setReferido(referidoActualizado[0])
            }
            setRetrieveReferidos(true)
            setLoadingReferidos(false)
          } else {
            setReferidos([])
            setRetrieveReferidos(true)
            setLoadingReferidos(false)
          }
        })
        .catch((e) => {
          setLoadingReferidos(false)
          setReferidos([])
        })
    }
  }

  const handleRegister = async (params) => {
    try {
      setLoadingAuth(true);
      let respMail = null;
      var entidad = "accounts"
      var fetch = "<fetch mapping='logical'>" +
        "<entity name='account'>" +
        "<attribute name='name'/> " +
        "<attribute name='accountid'/> " +
        "<attribute name='new_personeria'/>" +
        "<attribute name='new_estadodelsocio'/> " +
        "<attribute name='new_nmerodedocumento'/> " +
        "<order attribute ='createdon' descending='false' />" +
        "<filter type='and'>" +
        "<condition attribute='emailaddress1' operator='eq' value='" + params.email + "' />" +
        "<condition attribute='statecode' operator='eq' value='0' />" +
        "<condition attribute='new_relacionamientoconlasgr' operator='contain-values'>" +
        "<value>100000004</value>" +
        "</condition>" +
        "</filter>" +
        "</entity>" +
        "</fetch>";

      var Personeria = ''
      var accountid = ''
      var personeria = ''
      var name = ''
      var estado = ''
      var cuit = ''
      try {
        respMail = await axios.post(
          `${UrlApi}api/consultafetch`,
          {
            entidad: entidad,
            fetch: fetch,
          },
          {
            headers: {
              Authorization: `Bearer ${tokenSelector.token}`,
            },
          }
        );
      } catch (error) {
        setLoadingAuth(false);
        throw error
      }
      debugger
      if (respMail && respMail?.data.length > 0) {
        accountid = respMail.data[0].accountid;
        personeria = respMail.data[0].new_personeria
        name = respMail.data[0].name
        estado = respMail.data[0].new_estadodelsocio
        cuit = respMail.data[0].new_nmerodedocumento

        if (personeria === 100000000) {
          Personeria = 'J'
        } else {
          Personeria = 'F'
        }
        // Crea un nuevo usuario en Firebase con correo y contraseña
        const response = await createUserWithEmailAndPassword(auth, params.email, params.password);
        const uid = response.user.uid;

        // Guarda datos en el local storage
        window.localStorage.setItem('userData', dataEncrpt(JSON.stringify(response.user)));
        // Agrega un registro en la colección 'usuarios' en Firestore
        const usersCollection = collection(firestore, 'usuarios'); // Utiliza la función collection de firestore
        await addDoc(usersCollection, {
          correo: params.email,
          uid: uid,
          accountid: accountid,
          Personeria: Personeria,
          Name: name,
          Estado: estado,
          Cuit: cuit
        });

        setTimeout(() => {
          setLoadingAuth(false);
          router.replace('/');
        }, 2500);
        return {
          success: true
        }
      } else {
        setLoadingAuth(false);
        toast.error('No existe una cuenta con ese correo en nuestro sistema.', {
          theme: "dark",
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      setLoadingAuth(false);
      throw error;
    }
  };

  const handleLogin = async (params) => {
    try {
      setLoadingAuth(true);
      const response = await signInWithEmailAndPassword(auth, params.email, params.password);
      if (params.recordar) {
        window.localStorage.setItem('userData', dataEncrpt(JSON.stringify(response.user)));
      }
      const uid = response.user.uid;
      const usuariosCollection = collection(firestore, 'usuarios'); // Acceder a la colección
      const usuarioDoc = query(usuariosCollection, where('uid', '==', uid)); // Crear una consulta
      const querySnapshot = await getDocs(usuarioDoc);
      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        const { correo, accountid, nombreUsuario, uid, photoURL, photoPORTADA, Estado } = userData;
        setUser({
          correo,
          accountid,
          nombreUsuario,
          uid,
          photoURL,
          photoPORTADA,
          Estado
        });
      }
      setTimeout(() => {
        setLoadingAuth(false);
        router.replace('/');
      }, 2500);
      return {
        success: true
      }
    } catch (error) {
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || 'auth/invalid-login-credentials') {
        let message = error.message
        if (
          error.code === "auth/user-not-found" ||
          error.code === "auth/wrong-password" ||
          error.code === "auth/invalid-login-credentials"
        ) {
          message = "El correo electrónico o la contraseña no son válidos"
        }
        setLoadingAuth(false);
        return {
          success: false,
          error: {
            code: error.code || "unknown",
            message,
          },
        }
      } else {
        setLoadingAuth(false);
        return {
          success: false,
          error: {
            code: error.code || "unknown",
            message,
          },
        }
      }
    }
  };

  const handleForgotPassword = async (email) => {
    try {
      // Envia un correo electrónico de recuperación de contraseña
      await sendPasswordResetEmail(auth, email);
      // Puedes mostrar un mensaje al usuario indicando que se ha enviado un correo electrónico de recuperación de contraseña
      console.log('Se ha enviado un correo electrónico de recuperación de contraseña.');
    } catch (error) {
      throw error;
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null)
    window.localStorage.removeItem('userData')
    router.push('/login');
  };

  const actualizarFotoPerfil = async (imgEditada) => {
    // Mostrar una notificación de carga
    const toastLoading = toast.loading('Cargando...');

    try {
      // Referencia a Storage
      const storageRef = ref(storage, `${user.uid}/foto perfil`);

      // Subir la imagen editada a Storage
      await uploadBytes(storageRef, imgEditada);

      // Obtener la URL directa de la imagen
      const imgURL = await getDownloadURL(storageRef);

      if (user.uid) {
        // Referencia a Firestore
        const usuariosRef = collection(firestore, 'usuarios');
        const userQuery = query(usuariosRef, where('uid', '==', user.uid));
        const querySnapshot = await getDocs(userQuery);

        if (querySnapshot.docs.length > 0) {
          const userDoc = querySnapshot.docs[0];
          const userRef = doc(usuariosRef, userDoc.id);

          // Actualizar la propiedad 'photoURL' en Firestore
          await updateDoc(userRef, { photoURL: imgURL });

          // Actualizar solo la propiedad photoURL en el estado del componente
          setUser((prevUser) => ({
            ...prevUser,
            photoURL: imgURL,
          }));
          toast.dismiss(toastLoading);
          // Mostrar una notificación de éxito
          toast.success('Tu foto se ha cargado correctamente.');
        } else {
          // Mostrar una notificación de error
          toast.error("Usuario no encontrado.");
        }
      } else {
        // Mostrar una notificación de error
        toast.error("UID de usuario no definido.");
      }
    } catch (error) {
      // Mostrar una notificación de error en caso de excepción
      console.error(error);
      toast.error("Error al actualizar la foto de perfil");
    }
  };

  const actualizarFotoPortada = async (imgEditada) => {
    // Referencia a Storage
    const storageRef = ref(storage, `${user.uid}/foto portada`);
    const toastLoading = toast.loading('Cargando...');
    // Subir la imagen editada a Storage
    await uploadBytes(storageRef, imgEditada);

    // Obtener la URL directa de la imagen
    const imgURL = await getDownloadURL(storageRef);

    // Asegúrate de que user.uid tenga un valor definido
    if (user.uid) {
      // Referencia a Firestore
      const usuariosRef = collection(firestore, 'usuarios');
      const userQuery = query(usuariosRef, where('uid', '==', user.uid));
      const querySnapshot = await getDocs(userQuery);

      if (querySnapshot.docs.length > 0) {
        const userDoc = querySnapshot.docs[0];
        const userRef = doc(usuariosRef, userDoc.id);

        // Actualizar la propiedad 'photoURL' en Firestore
        await updateDoc(userRef, { photoPORTADA: imgURL });

        // Actualizar solo la propiedad photoURL en el estado del componente
        setUser((prevUser) => ({
          ...prevUser,
          photoPORTADA: imgURL,
        }));

        toast.dismiss(toastLoading);
        toast.success('Tu foto se ha cargado correctamente.');
      } else {
        toast.error("Usuario no encontrado.");
      }
    } else {
      toast.error("UID de usuario no definido.");
    }
  }

  let accountID = {};

  const actualizarReferido = (referido) => {
    if (referido?.accountid != null) {
      setReferido(referido);
      accountID = { accountid: referido.accountid };
      window.localStorage.setItem('accountID', JSON.stringify(accountID));
      window.localStorage.setItem('referido', JSON.stringify(referido));
      router.replace('/inicio');
    }
  };

  const values = {
    user,
    loading,
    loadingReferidos,
    loadingAuth,
    token, // Agregamos el token aquí
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister,
    forgotPassword: handleForgotPassword,
    actualizarFotoPerfil,
    actualizarFotoPortada,
    actualizarPerfil: actualizarMiPerfil,
    referido,
    actualizarReferido,
    referidos,
    retrieveReferidos,
    RefrescarReferidos
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }

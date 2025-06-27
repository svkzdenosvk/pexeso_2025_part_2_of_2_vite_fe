import { useState } from "react";
import { TextField, Button, Alert, Box } from "@mui/material";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";

import { auth, projectUsers } from "@pexeso/lib/firebase/firestoreConfigUsers";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";

const sxStyles = {
  input: { mb: 2, width: "100%" },
  form: { maxWidth: 400, mx: "auto", mt: 4 },
};

export const Registration = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate(); // 👈 pridaj
  const { lang } = useParams();

  const validate = () => {
    const { password, confirm, name, email } = form;
    if (name.length < 3) return "Meno musí byť min 3 znaky dlhé";
    if (name.length > 50) return "Meno musí byť max 50 znaky dlhé";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return " Email nie je v platnom formáte";
    if (password.length < 6 || password.length > 20)
      return "Heslo musí mať 6 až 20 znakov.";
    if (!/[A-Z]/.test(password)) return "Heslo musí obsahovať veľké písmeno.";
    if (!/[!@#$%^&*]/.test(password))
      return "Heslo musí obsahovať špeciálny znak.";
    if (password !== confirm) return "Heslá sa nezhodujú.";
    return "";
  };

  const handleRegister = async () => {
    const validationError = validate();
    if (validationError) return setError(validationError);

    try {
      const res = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      await setDoc(doc(projectUsers, "users", res.user.uid), {
        name: form.name,
        email: form.email,
        createdAt: serverTimestamp(),
      });
      setError(""); // úspešná registrácia
      setForm({ name: "", email: "", password: "", confirm: "" });
      navigate(`/${lang}/login `, { state: { fromRegister: true } }); // ✅ redirect s flagom
    } catch (e) {
      const err = e as FirebaseError;
      console.error("Firebase Error:", err.code, err.message); // <- pridaj toto

      if (err.code === "auth/email-already-in-use") {
        setError("Tento email už je zaregistrovaný.");
      } else {
        setError("Počas registrácie nastala chyba");
      }
    }
  };

  return (
    <Box sx={sxStyles.form}>
      <TextField
        label="Používateľské meno"
        sx={sxStyles.input}
        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
      />
      <TextField
        label="Email"
        sx={sxStyles.input}
        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
      />
      <TextField
        label="Heslo"
        type="password"
        sx={sxStyles.input}
        onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
      />
      <TextField
        label="Potvrď heslo"
        type="password"
        sx={sxStyles.input}
        onChange={(e) => setForm((f) => ({ ...f, confirm: e.target.value }))}
      />
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Button variant="contained" fullWidth onClick={handleRegister}>
        Registrovať
      </Button>
    </Box>
  );
};

export default Registration;

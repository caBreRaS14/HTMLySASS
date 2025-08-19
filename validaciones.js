// Utilidad: marcar campo válido/inválido y pintar mensaje
function setFieldState(input, ok, msgId, msgText = "") {
  const msg = document.getElementById(msgId);
  if (ok) {
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
    msg.textContent = "";
  } else {
    input.classList.remove("is-valid");
    input.classList.add("is-invalid");
    msg.textContent = msgText;
  }
}

// Edad exacta >= 18
function esMayorDeEdad(isoDateStr) {
  if (!isoDateStr) return false;
  const hoy = new Date();
  const nac = new Date(isoDateStr);
  if (Number.isNaN(nac.getTime())) return false;

  let edad = hoy.getFullYear() - nac.getFullYear();
  const m = hoy.getMonth() - nac.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) edad--;

  return edad >= 18;
}

// Fijar el máximo permitido en el date a "hoy - 18 años"
function setMaxFecha18() {
  const inputFecha = document.getElementById("fecha");
  const hoy = new Date();
  hoy.setFullYear(hoy.getFullYear() - 18);
  const yyyy = hoy.getFullYear();
  const mm = String(hoy.getMonth() + 1).padStart(2, "0");
  const dd = String(hoy.getDate()).padStart(2, "0");
  inputFecha.max = `${yyyy}-${mm}-${dd}`;
}

function toggleSubmit() {
  const btn = document.getElementById("btnEnviar");
  const form = document.getElementById("registroForm");
  // Habilitar solo si todo el form es válido según nuestras validaciones y el checkbox está activo
  const allValid = form.checkValidity() &&
                   document.getElementById("terminos").checked &&
                   // y validaciones custom (passwords, edad)
                   document.getElementById("error-password").textContent === "" &&
                   document.getElementById("error-confirmar").textContent === "" &&
                   document.getElementById("error-fecha").textContent === "" &&
                   document.getElementById("error-celular").textContent === "" &&
                   document.getElementById("error-telefono").textContent === "" &&
                   document.getElementById("error-email").textContent === "" &&
                   document.getElementById("error-nombre").textContent === "";
  btn.disabled = !allValid;
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registroForm");
  const msjExito = document.getElementById("mensajeExito");

  setMaxFecha18();

  // Validaciones en tiempo real
  form.addEventListener("input", (e) => {
    const id = e.target.id;

    if (id === "nombre") {
      const ok = e.target.value.trim().length >= 3;
      setFieldState(e.target, ok, "error-nombre", "El nombre debe tener al menos 3 caracteres.");
    }

    if (id === "email") {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const ok = re.test(e.target.value);
      setFieldState(e.target, ok, "error-email", "Correo inválido.");
    }

    if (id === "password") {
      const re = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.,;:_#\-])[A-Za-z\d@$!%*?&.,;:_#\-]{8,}$/;
      const ok = re.test(e.target.value);
      setFieldState(e.target, ok, "error-password", "Mín. 8, 1 mayús, 1 número, 1 símbolo.");
      // Si cambia la contraseña, revalida confirmación
      const confirmar = document.getElementById("confirmar");
      if (confirmar.value !== "") {
        const iguales = confirmar.value === e.target.value;
        setFieldState(confirmar, iguales, "error-confirmar", "Las contraseñas no coinciden.");
      }
    }

    if (id === "confirmar") {
      const pass = document.getElementById("password").value;
      const iguales = e.target.value === pass;
      setFieldState(e.target, iguales, "error-confirmar", "Las contraseñas no coinciden.");
    }

    if (id === "fecha") {
      const ok = esMayorDeEdad(e.target.value);
      setFieldState(e.target, ok, "error-fecha", "Debes tener al menos 18 años.");
    }

    if (id === "celular") {
      // 10 dígitos y empieza por 3
      const ok = /^[3][0-9]{9}$/.test(e.target.value);
      setFieldState(e.target, ok, "error-celular", "Celular inválido (10 dígitos, empieza por 3).");
    }

    if (id === "telefono") {
      // opcional, pero si hay valor: al menos 10 dígitos
      const v = e.target.value.trim();
      const ok = v === "" || /^[0-9]{10,}$/.test(v);
      setFieldState(e.target, ok, "error-telefono", "Debe tener mínimo 10 dígitos.");
    }

    if (id === "terminos") {
      document.getElementById("error-terminos").textContent = e.target.checked ? "" : "Debes aceptar los términos.";
    }

    toggleSubmit();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Dispara validaciones finales
    form.querySelectorAll("input").forEach(inp => inp.dispatchEvent(new Event("input")));

    if (document.getElementById("btnEnviar").disabled) return;

    // "Enviar" (solo frontend). Mostrar éxito y resetear.
    msjExito.hidden = false;
    form.reset();

    // Quita clases de validación
    form.querySelectorAll("input").forEach(i => {
      i.classList.remove("is-valid", "is-invalid");
    });

    // Limpia mensajes
    form.querySelectorAll(".error").forEach(e => e.textContent = "");
    toggleSubmit();
    setMaxFecha18();
  });
});

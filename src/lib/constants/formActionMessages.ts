export const internalServerError = {
	message: 'Ha ocurrido un error interno.',
	success: false,
};

export const emailAlreadyInUse = {
	message: 'El correo electrónico ya está en uso.',
	success: false,
};

export const sendEmailVerificationError = {
	message:
		'Error al enviar el correo electrónico con el código de verificación. Por favor intente de nuevo',
	success: false,
};

export const invalidEmailOrPassword = {
	message: 'Correo electrónico o contraseña incorrectos.',
	success: false,
};

export const errorValidatingUser = {
	message: 'Hubo un problema al validar tu usuario. Por favor, intenta volver a iniciar sesión.',
	success: false,
};

export const errorCreatingUser = {
	message: 'Hubo un problema al crear tu usuario. Por favor, intenta volver a registrarte.',
	success: false,
};

export const forbiddenActionError = {
	message: 'Acceso denegado: No tienes permisos para realizar esta acción.',
	success: false,
};

export const forbiddenActionErrorWithEmailInstructions = {
	message:
		'Acceso denegado: No tienes permisos para realizar esta acción. Por favor, utilice un link de renovación de contraseña valido.',
	success: false,
};

export const invalidEmail = {
	message: 'Correo electrónico inválido.',
	success: false,
};

export const inexistentEmail = {
	message: 'Correo electrónico inexistente en la base de datos.',
	success: false,
};

export const sendTemporalPasswordError = {
	message: 'Error al enviar el correo electrónico. Por favor intente seguir el flujo de reenvío',
	success: false,
};

export const invalidTokenError = {
	message: 'El link utilizado es inválido o se encuentra expirado.',
	success: false,
};

export const invalidCodeError =  {
	message: 'El código proporcionado es inválido',
	success: false,
}

export const  InfoSavedCorrectly ={
	message : 'Información guardada correctamente',
	success: true
}
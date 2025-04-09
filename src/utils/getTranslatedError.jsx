export const getTranslatedError = (t, error) => {
    const code = error?.response?.data?.errorCode;
    const defaultMsg = error?.response?.data?.error;
  
    return t(`errors.${code}`) || defaultMsg || t("errors.1001");
  };
  
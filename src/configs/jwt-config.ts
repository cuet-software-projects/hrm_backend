const getSecretKey = () => {
  return process.env.JWT_SECRET_KEY || '1234456778fgsdfouasIHJKABSIUHBDSA^T(*@#*(*@(';
};

export default getSecretKey;

import formidable from "formidable";

export const parseForm = (req, isMultiple) => {
  const form = formidable({ multiples: isMultiple });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
};

export const submitFeedback = async (data: any) => {
  const res = await fetch("http://localhost:4000/api/feedback", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
};
function status(request, response) {
  response.status(200).json({ message: "success" });
}

export default status;

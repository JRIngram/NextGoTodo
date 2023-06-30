const fetchTest = async () => await fetch(
  `http://127.0.0.1:8080/todo/1`,
  {
    method: "put",
    body: JSON.stringify({
      task: "test",
      completed: false,
    }),
  }
)

fetchTest().then(async (res) => console.log(await res.json()))
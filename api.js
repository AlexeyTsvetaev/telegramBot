const optionsGetToken = {
  method: 'POST',
  headers: {"Content-Type": "application/json"},
}
const auth = (login, pass) => {
  const options = {
    username: login,
    password: pass,
  }
  return options
}
let authValid = auth()

const tokenEndPoint = 'http://dev.kerong.ru:9777/api/v1/auth/token'
//-----------------------------------------------------------------------------------------------
const getToken = async (callback) => {
  const response = await fetch(tokenEndPoint, {
    ...optionsGetToken,
    body: JSON.stringify(auth('admin', 'masterkey'))
  })
  const result = await response.json()
  callback(result.token)
}
//-----------------------------------------------------------------------------------------------


const getClientsListEndPoint = "http://dev.kerong.ru:9777/api/v1/"
const GetClientsList = async (token) => { 
  const optionsGetClientsList = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    }
  }
  const response = await fetch(getClientsListEndPoint, optionsGetClientsList)
  const clientsList = await response.json()
  console.log(clientsList);
}

getToken((token) => GetClientsList(token))

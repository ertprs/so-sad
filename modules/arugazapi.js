const axios = require('axios');

const lirik = async (judul) => new Promise((resolve, reject) => {
	axios.get(`https://arugaz.herokuapp.com/api/lirik?judul=${judul}`)
	.then((res) => {
		resolve(res.data.result)
	})
	.catch((err) => {
		return "error"
	})
})

const wiki = async (judul) => new Promise((resolve, reject) => {
	axios.get(`https://arugaz.herokuapp.com/api/wiki?q=${judul}`)
	.then((res) => {
		resolve(res.data.result)
	})
	.catch((err) => {
		return "error"
	})
})

module.exports = {
	lirik,
	wiki
}

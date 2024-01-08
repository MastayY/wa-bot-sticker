function tanggal(numer) {
	myMonths = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
	myDays = ['Minggu','Senin','Selasa','Rabu','Kamis','Jum’at','Sabtu']; 
	var tgl = new Date(numer);
	var day = tgl.getDate()
	bulan = tgl.getMonth()
	var thisDay = tgl.getDay(),
	thisDay = myDays[thisDay];
	var yy = tgl.getYear()
	var year = (yy < 1000) ? yy + 1900 : yy; 
	// const time = moment.tz('Asia/Jakarta').format('DD/MM HH:mm:ss')
	let d = new Date
	// let locale = 'id'
	let gmt = new Date(0).getTime() - new Date('1 January 1970').getTime()
	// let weton = ['Pahing', 'Pon','Wage','Kliwon','Legi'][Math.floor(((d * 1) + gmt) / 84600000) % 5]
	
	return`${thisDay}, ${day} ${myMonths[bulan]} ${year}`
}

function getGreeting() {
	const currentHour = new Date().getHours();

	if (currentHour >= 0 && currentHour < 12) {
		return "Selamat pagi";
	} else if (currentHour >= 12 && currentHour < 15) {
		return "Selamat siang";
	} else if (currentHour >= 15 && currentHour < 18) {
		return "Selamat sore";
	} else {
		return "Selamat malam";
	}
}

module.exports = {
    getGreeting,
    tanggal
}
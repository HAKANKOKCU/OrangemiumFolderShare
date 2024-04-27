const http = require('http');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
var port = 842;
var folder = "";
var argpt = "";
var gavecustomargs = false;
var allowwrite = false;
var rules;

Number.prototype.pad = function(size) {
    var s = String(this);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
}

let diff = -(new Date().getTimezoneOffset());
process.argv.forEach((itm) => {
	if (itm.startsWith("--")) {
		argpt = itm;
		gavecustomargs = true;
	}else {
		if (argpt == "--port") {
			port = parseInt(itm);
		}
		if (argpt == "--folder") {
			folder = itm;
		}
		if (argpt == "--allowwrites") {
			console.error("Removed: --allowwrites");
			process.exit();
		}
		if (argpt == "--rules") {
			var jsondata = JSON.parse(fs.readFileSync(itm));
			allowwrite = jsondata.allowwrites;
			rules = jsondata;
		}
	}
})
const readline = require('readline').createInterface({
	input: process.stdin,
	output: process.stdout
});

function repsondwithdir(foldr,res,password) {
	if (password == rules.adminpassword) {
		allowwrite = true;
	}else {
		var rlf = rules.exceptions[foldr.replace(folder,"") + (foldr.includes(folder) ? "/" : "")];
		if (rlf != undefined) {
			allowwrite = rlf.allowwrites;
		}else {
			var isfound = false;
			Object.keys(rules.exceptions).forEach(function(i) {
				var ip = isparent(foldr.replace(folder,"") + (foldr.includes(folder) ? "/" : ""), i)
				var rlf = rules.exceptions[i];
				allowwrite = rlf.allowwrites;
				isfound = ip;
			})
			if (!isfound) allowwrite = rules.allowwrites;
		}
	}
	console.log(password, allowwrite)
	res.writeHead(200, {"Content-Type": "text/html"});
	var slashchar = (folder.includes("\\") ? "\\" : "/")
	res.write("<!DOCTYPE html><head><title>" + path.basename(foldr) + " - Orangemium Folder Share</title><meta name='color-scheme' content='light dark'><meta charset='utf-8'><!--<meta name='viewport' content='width=device-width, initial-scale=1.0'>--><style>button.orangeh {border:none;} a:hover,.orangeh:hover {background:orange;} a:active,.orangeh:active {background:darkorange;} a {color:inherit;display:flex;overflow-wrap: anywhere;text-decoration:none;padding:2px;} a svg {flex-shrink:0;} ul {list-style:none;padding:0;} body {font-family: Verdana, sans-serif;accent-color:orange;} td,th {border: 1px solid gray} table {width:100%;}</style></head><h1>File list of directory \"" + (foldr.replace(folder,"") + (foldr.includes(folder) ? "/" : "")).replace(/\//g,slashchar) + "\"</h1><a href='" + foldr.replace(/'/g, "\\'").replace(folder,"") + (foldr.includes(folder) ? "/" : "") + "download|zip' download style='display:inline-block'>Download Zip</a>" + (allowwrite ? "<button id='fcrat'>Create Folder</button><input type='file' id='fileUpload' multiple><input type='file' id='folderUpload' webkitdirectory multiple><br><table id='uploadscont'></table><script>var utf8 = /([\\x00-\\x7F]|([\\xC2-\\xDF]|\\xE0[\\xA0-\\xBF]|\\xED[\\x80-\\x9F]|(|[\\xE1-\\xEC]|[\\xEE-\\xEF]|\\xF0[\\x90-\\xBF]|\\xF4[\\x80-\\x8F]|[\\xF1-\\xF3][\\x80-\\xBF])[\\x80-\\xBF])[\\x80-\\xBF])*/g;var uploadscount = 0;function handleImageUpload(event) {let folders = [];for (var i = 0; i < event.target.files.length;i++) {const file = event.target.files[i];let path = file.webkitRelativePath; if (path == undefined || path.trim() == '') {path = file.name} if(path.includes('/')) {let fol = path.substring(0,path.lastIndexOf('/')+1); if (folders.indexOf(fol) == -1)folders.push(fol)}};if (folders.length == 0) {startfileuploads()} else {let dv = document.createElement('tr');dv.style.padding = '8px';let filelbl = document.createElement('td');let proglbl = document.createElement('td');filelbl.style.margin = '2px';proglbl.style.margin = '2px';let fileprog = document.createElement('progress');fileprog.max = 100;let fileprogcont = document.createElement('td');fileprogcont.appendChild(fileprog);fileprog.style.margin = '2px';dv.appendChild(filelbl);dv.appendChild(fileprogcont);dv.appendChild(proglbl);filelbl.innerText = 'Creating Folders...';document.getElementById('uploadscont').appendChild(dv);let cnter = folders.length;for (let i = 0; i < folders.length;i++) {var name = folders[i];if (name != null && name.trim() != '') {fetch('" + foldr.replace(/'/g, "\\'").replace(folder,"") + (foldr.includes(folder) ? "/" : "") + "newfolder" + "', {body: JSON.stringify({'name': name}),headers: {password: '" + password + "'},method: 'POST'}).then(function(response) { response.json()}).then(function(data) {cnter-=1;proglbl.innerText = (folders.length - cnter) + '/' + folders.length.toString();fileprog.value = ((folders.length - cnter) / folders.length) * 100; if (cnter == 0) {startfileuploads()}}).catch(function(error) {cnter-=1; proglbl.innerText = (folders.length - cnter) + '/' + folders.length.toString();fileprog.value = ((folders.length - cnter) / folders.length) * 100; if (cnter == 0) {startfileuploads()}});}else {cnter-=1; proglbl.innerText = (folders.length - cnter) + '/' + folders.length.toString();fileprog.value = ((folders.length - cnter) / folders.length) * 100; if (cnter == 0) {startfileuploads()}}}};function startfileuploads() {console.log(event.target.files);var a = 0;uploadscount = event.target.files.length - 1; if (uploadscount == 0) uploadscount = 1;for (a=0; a < 5;a++) {startdownload(a)} function startdownload(i) {try {const file = event.target.files[i];if (file == null) return;console.log(file);let path = file.webkitRelativePath; if (path == undefined || path.trim() == '') {path = file.name};let dv = document.createElement('tr');dv.style.padding = '8px';let filelbl = document.createElement('td');let proglbl = document.createElement('td');filelbl.style.margin = '2px';proglbl.style.margin = '2px';let fileprog = document.createElement('progress');let fileprogcont = document.createElement('td');fileprogcont.appendChild(fileprog);fileprog.style.margin = '2px';dv.appendChild(filelbl);dv.appendChild(fileprogcont);dv.appendChild(proglbl);filelbl.innerText = path;document.getElementById('uploadscont').appendChild(dv);const xhr = new XMLHttpRequest();xhr.upload.addEventListener('progress', function(e) {fileprog.value = e.loaded / e.total;proglbl.innerText = e.loaded.toString() + ' / ' + e.total.toString() + ' (' + Math.floor((e.loaded / e.total) * 100).toString() + '%)';});xhr.open('POST', './" + foldr.replace(/'/g, "\\'").replace(folder,"") + (foldr.includes(folder) ? "/" : "") + "' + path.substring(0,path.lastIndexOf('/')+1) + '/upload" + "', true);xhr.setRequestHeader('filename',encodeURI(file.name));xhr.setRequestHeader('password','" + password + "');xhr.addEventListener('load', function() {uploadscount--;a++;startdownload(a);document.getElementById('uploadscont').removeChild(dv);refreshwhenfinished();});xhr.addEventListener('error', function() {console.error(error);uploadscount--;a++;startdownload(a);document.getElementById('uploadscont').appendChild(dv);refreshwhenfinished();});xhr.addEventListener('abort', function() {uploadscount--;document.getElementById('uploadscont').appendChild(dv);refreshwhenfinished();});xhr.send(file);/*fetch('" + foldr.replace(/'/g, "\\'").replace(folder,"") + (foldr.includes(folder) ? "/" : "") + "upload" + "', {headers: {'filename': file.name},method: 'POST',body: file}).then(function(response) { response.json()}).then(function(data) {console.log(data);uploadscount--;document.getElementById('uploadscont').removeChild(dv);refreshwhenfinished();}).catch(function(error) {console.error(error);uploadscount--;document.getElementById('uploadscont').appendChild(dv);refreshwhenfinished();});*/}catch (e) {console.error(e)}}}}\nfunction init() {document.getElementById('fileUpload').addEventListener('change', function(event) {handleImageUpload(event)});document.getElementById('folderUpload').addEventListener('change', function(event) {handleImageUpload(event)});document.getElementById('fcrat').addEventListener('click', function(event) {var name = prompt('Enter name for new folder:');if (name != null && name.trim() != '') {uploadscount++;fetch('" + foldr.replace(/'/g, "\\'").replace(folder,"") + (foldr.includes(folder) ? "/" : "") + "newfolder" + "', {body: JSON.stringify({'name': name}),headers: {password: '" + password + "'},method: 'POST'}).then(function(response) { response.json()}).then(function(data) {console.log(data);uploadscount--;refreshwhenfinished();}).catch(function(error) {console.error(error);uploadscount--;refreshwhenfinished();});}});}\ninit();\nfunction refreshwhenfinished() {if (uploadscount == 0) {location.reload();}}\nfunction deletedir(name) {if (confirm('Delete?') == false) {return;};uploadscount++;fetch('" + foldr.replace(/'/g, "\\'").replace(folder,"") + (foldr.includes(folder) ? "/" : "") + "deletefolder" + "', {body: JSON.stringify({'name': name}),headers: {password: '" + password + "'},method: 'POST'}).then(function(response) {response.json()}).then(function(data)  {console.log(data);uploadscount--;refreshwhenfinished();}).catch(function(error)  {console.error(error);uploadscount--;refreshwhenfinished();});}\nfunction deletefile(name) {if (confirm('Delete?') == false) {return;};uploadscount++;fetch('" + foldr.replace(/'/g, "\\'").replace(folder,"") + (foldr.includes(folder) ? "/" : "") + "deletefile" + "', {body: JSON.stringify({'name': name}),headers: {password: '" + password + "'},method: 'POST'}).then(function(response) {response.json()}).then(function(response)  {console.log(data);uploadscount--;refreshwhenfinished();}).catch(function(error)  {console.error(error);uploadscount--;refreshwhenfinished();});}\nfunction rename(oldname) {var name = prompt('Enter name for renaming:',oldname);if (name != null && name.trim() != '') {uploadscount++;fetch('" + foldr.replace(/'/g, "\\'").replace(folder,"") + (foldr.includes(folder) ? "/" : "") + "rename" + "', {body:JSON.stringify({'oldname': oldname,'newname':name}),headers: {password: '" + password + "'},method: 'POST'}).then(function (response) { response.json()}).then(function(data) {console.log(data);uploadscount--;refreshwhenfinished();}).catch(function(error) {console.error(error);uploadscount--;refreshwhenfinished();});}}\nfunction copyfile(fromname) {var toname = prompt('Enter path to copy to:','" + foldr.replace(/'/g, "\\'").replace(folder,"") + (foldr.includes(folder) ? "/" : "") + "' + fromname" + ");if (toname != null && toname.trim() != '') {uploadscount++;fetch('copyfile', {body:JSON.stringify({'fromname': '" + foldr.replace(/'/g, "\\'").replace(folder,"") + (foldr.includes(folder) ? "/" : "") + "' + fromname" + ",'toname':toname}),headers: {password: '" + password + "'},method: 'POST'}).then(function(response) {response.json()}).then(function(data) {console.log(data);uploadscount--;refreshwhenfinished();}).catch(function(error) {console.error(error);uploadscount--;refreshwhenfinished();});}}\nfunction copyfolder(fromname) {var toname = prompt('Enter path to copy to:','" + foldr.replace(/'/g, "\\'").replace(folder,"") + (foldr.includes(folder) ? "/" : "") + "' + fromname" + ");if (toname != null && toname.trim() != '') {uploadscount++;fetch('copyfolder', {body:JSON.stringify({'fromname': '" + foldr.replace(/'/g, "\\'").replace(folder,"") + (foldr.includes(folder) ? "/" : "") + "' + fromname" + ",'toname':toname}),headers: {password: '" + password + "'},method: 'POST'}).then(function(response) {response.json()}).then(function(data) {console.log(data);uploadscount--;refreshwhenfinished();}).catch(function(error) {console.error(error);uploadscount--;refreshwhenfinished();});}}\nfunction move(fromname) {var toname = prompt('Enter path to move to:','" + foldr.replace(/'/g, "\\'").replace(folder,"") + (foldr.includes(folder) ? "/" : "") + "' + fromname" + ");if (toname != null && toname.trim() != '') {uploadscount++;fetch('move', {body:JSON.stringify({'fromname': '" + foldr.replace(/'/g, "\\'").replace(folder,"") + (foldr.includes(folder) ? "/" : "") + "' + fromname" + ",'toname':toname}),headers: {password: '" + password + "'},method: 'POST'}).then(function(response) { response.json()}).then(function(data) {console.log(data);uploadscount--;refreshwhenfinished();}).catch(function(error) {console.error(error);uploadscount--;refreshwhenfinished();});}}</script>" : "<form method='POST'><input name='password' type='password' placeholder='Password'><input type='submit' value='Login'><input name='type' type='hidden' value='html'></input></form>"));
	fs.readdir(foldr, (err, files) => {
		if (err) {
			res.end(err.toString())
		}else {
			var dfolders = [];
			var dfiles = [];
			files.forEach(file => {
				try {
					var fpath = path.resolve( foldr, file );
					if (fs.lstatSync(fpath).isDirectory()) {
						dfolders.push(file);
					}else {
						dfiles.push(file);
					}
				}catch (e) {
					res.write(file + " is hidden because:" + e.toString() + "<br>");
				}
			});
			res.write(files.length + " Total: " + dfiles.length + " Files, " + dfolders.length + " Folders")
			res.write("<table><tr><th>Name</th><th>Size</th><th>Creation</th><th>Modification</th>" + (allowwrite ? "<th></th><th></th><th></th><th></th></tr>" : ""));
			dfolders.forEach((dir) => {
				var fpath = path.resolve( foldr, dir );
				var name = path.basename(dir);
				res.write("<tr><td><form method='post' action='" + foldr.replace(/'/g, "&apos;").replace(folder,"") + (foldr.includes(folder) ? "/" : "") + dir.replace(/'/g, "&apos;") + "'><input name='type' type='hidden' value='html'><input type='hidden' name='password' value='"+password+"'><a onclick='this.parentNode.submit();return false' href='" + foldr.replace(/'/g, "&apos;").replace(folder,"") + (foldr.includes(folder) ? "/" : "") + dir.replace(/'/g, "&apos;") + "'><svg xmlns='http://www.w3.org/2000/svg' height='20' viewBox='0 -960 960 960' width='20' style='fill:canvasText;margin:0px;'><path d='M168-192q-29 0-50.5-21.5T96-264v-432q0-29.7 21.5-50.85Q139-768 168-768h185.643q14.349 0 27.353 5Q394-758 405-747l75 75h312q29.7 0 50.85 21.15Q864-629.7 864-600v336q0 29-21.15 50.5T792-192H168Z'/></svg>" + name + "</a></form></td><td></td><td></td><td></td>" + (allowwrite ? "<td><button class='orangeh' onclick='deletedir(\"" + dir.replace(/\"/g,"\\\"").replace(/'/g, "&apos;") + "\")'>Delete</button></td><td><button class='orangeh' onclick='rename(\"" + dir.replace(/\"/g,"\\\"").replace(/'/g, "&apos;") + "\")'>Rename</button></td><td><button class='orangeh' onclick='copyfolder(\"" + dir.replace(/\"/g,"\\\"").replace(/'/g, "&apos;") + "\")'>Copy</button></td><td><button class='orangeh' onclick='move(\"" + dir.replace(/\"/g,"\\\"").replace(/'/g, "&apos;") + "\")'>Move</button></td>" : "") + "</tr>");
			});
			dfiles.forEach((file) => {
				var fpath = path.resolve( foldr, file );
				var name = path.basename(file);
				var extension = path.extname(file);
				var stats = fs.statSync(fpath)
				var datem = new Date(stats.mtimeMs)
				var datec = new Date(stats.ctimeMs)
				res.write("<tr><td><a target='_blank' href='" + foldr.replace(/'/g, "&apos;").replace(folder,"") + (foldr.includes(folder) ? "/" : "") + file.replace(/'/g, "&apos;") + "'><svg xmlns='http://www.w3.org/2000/svg' height='20' viewBox='0 -960 960 960' width='20' style='fill:canvasText;margin:0px;'><path d='M263.717-96Q234-96 213-117.15T192-168v-624q0-29.7 21.15-50.85Q234.3-864 264-864h282q14 0 27.5 5t23.5 16l150 150q11 10 16 23.5t5 27.5v474q0 29.7-21.162 50.85Q725.676-96 695.96-96H263.717ZM528-660q0 15.3 10.35 25.65Q548.7-624 564-624h132L528-792v132Z'/></svg>" + name + "</a></td><td>" + stats.size + "</td><td>" + (datec.getMonth() + 1).pad() + " " + datec.getDate().pad() + " " + datec.getFullYear() + ", " + datec.getHours().toString().padStart(2, '0') + ":" + datec.getMinutes().toString().padStart(2, '0') + " " + ((diff<=0?"":"+") + Math.floor(diff / 60).pad().toString() + ":" + Math.floor(diff % 60).pad().toString()) + "</td><td>" + (datem.getMonth() + 1).pad() + " " + datem.getDate().pad() + " " + datem.getFullYear() + ", " + datem.getHours().toString().padStart(2, '0') + ":" + datem.getMinutes().toString().padStart(2, '0') + " " + ((diff<=0?"":"+") + Math.floor(diff / 60).pad().toString() + ":" + Math.floor(diff % 60).pad().toString()) + "</td>" + (allowwrite ? "<td><button class='orangeh' onclick='deletefile(\"" + file.replace(/\"/g,"\\\"").replace(/'/g, "&apos;") + "\")'>Delete</button></td><td><button class='orangeh' onclick='rename(\"" + file.replace(/\"/g,"\\\"").replace(/'/g, "&apos;") + "\")'>Rename</button></td><td><button class='orangeh' onclick='copyfile(\"" + file.replace(/\"/g,"\\\"").replace(/'/g, "&apos;") + "\")'>Copy</button></td><td><button class='orangeh' onclick='move(\"" + file.replace(/\"/g,"\\\"").replace(/'/g, "&apos;") + "\")'>Move</button></td>" : "") + "</tr>");
			})
			res.end("</table>");
		}
	});
}

const requestListener = function (req, res) {
	//res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    //res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    //res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
	console.log(req.url)
	if (req.headers.password == rules.adminpassword) {
		allowwrite = true;
	}else {
		var rlf = rules.exceptions[req.url.replace(folder,"") + (req.url.includes(folder) ? "/" : "")];
		if (rlf != undefined) {
			allowwrite = rlf.allowwrites;
		}else {
			var isfound = false;
			Object.keys(rules.exceptions).forEach(function(i) {
				var ip = isparent(url.replace(folder,"") + (url.includes(folder) ? "/" : ""), i)
				var rlf = rules.exceptions[i];
				allowwrite = rlf.allowwrites;
				isfound = ip;
			})
			if (!isfound) allowwrite = rules.allowwrites;
		}
	}
	console.log(allowwrite)
	if (req.url == "/") {
		if (fs.existsSync(folder + "/IHOMEPAG.html")) {
			res.writeHead(302, {
			  'Location': '/IHOMEPAG.html'
			  //add other headers here...
			});
			res.end();
		}else {
			res.writeHead(302, {
			  'Location': '/@!MAINDIRVIEW!'
			  //add other headers here...
			});
			res.end();
		}
	}else if (req.url == "/@!MAINDIRVIEW!") {
		let data = []
		req.on('data', (chunk) => {
			data.push(chunk)
		})
		req.on('end', () => {
			var formdata = formtojson(data.toString());
			repsondwithdir(folder,res,formdata["password"]);
		})
	}else if (req.url.endsWith("/upload") && req.method.toLowerCase() == 'post' && allowwrite) {
		res.setHeader('Content-Type', 'application/json')

		let contentLength = parseInt(req.headers['content-length'])
		if (isNaN(contentLength) || contentLength <= 0 ) {
		  res.statusCode = 411;
		  res.end(JSON.stringify({status: "error", description: "No File"}))
		  return
		}
		// Try to use the original filename
		let filename = decodeURI(req.headers['filename']);
		if (filename == null) {
		  filename = "file." + req.headers['content-type'].split('/')[1];
		}
		var url = "";
		var sp = decodeURIComponent(req.url).split("/");
		sp.forEach(function(itm,i) {
			if (req.url.startsWith("/html") ? i > 1 : i != 0) {
				if (i != sp.length - 1) {
					url += itm + (i == sp.length - 2 ? "" : "/");
				}
			}	
		});
		
		
		if (!allowwrite) {
			res.statusCode = 403;
			res.write(JSON.stringify({status: "error", description: "PERM INVALID"}))
			res.end()
			return;
		}
		
		const filestream = fs.createWriteStream(path.join(folder,`${url}/${filename}`))

		filestream.on("error", (error) => {
		  console.error(error)
		  res.statusCode = 400;
		  res.write(JSON.stringify({status: "error", description: error}))
		  res.end()
		})
		

		// Write data as it comes
		req.pipe(filestream)

		req.on('end', () => {
		  filestream.close(() => {
			try {
			res.end(JSON.stringify({status: "success"}))
			}catch {}
		  })
		})
	}else if (req.url.endsWith("/newfolder") && req.method.toLowerCase() == 'post' && allowwrite) {
		res.setHeader('Content-Type', 'application/json')
		let data = []
		req.on('data', (chunk) => {
			data.push(chunk)
		})
		req.on('end', () => {
			var bd = JSON.parse(data);
			// Try to use the original filename
			let filename = bd['name']
			if (filename == null) {
				res.statusCode = 411;
				res.end(JSON.stringify({status: "error", description: "No Folder Name"}))
				return
			}
			var url = "";
			var sp = decodeURIComponent(req.url).split("?")[0].split("/");
			sp.forEach(function(itm,i) {
				if (req.url.startsWith("/html") ? i > 1 : i != 0) {
					if (i != sp.length - 1) {
						url += itm + (i == sp.length - 2 ? "" : "/");
					}
				}	
			});
			
			if (req.headers.password == rules.adminpassword) {
				allowwrite = true;
			}else {
				var rlf = rules.exceptions[url.replace(folder,"") + (url.includes(folder) ? "/" : "")];
				if (rlf != undefined) {
					allowwrite = rlf.allowwrites;
				}else {
					var isfound = false;
					Object.keys(rules.exceptions).forEach(function(i) {
						var ip = isparent(url.replace(folder,"") + (url.includes(folder) ? "/" : ""), i)
						var rlf = rules.exceptions[i];
						allowwrite = rlf.allowwrites;
						isfound = ip;
					})
					if (!isfound) allowwrite = rules.allowwrites;
				}
			}
			
			if (!allowwrite) {
				res.statusCode = 403;
				res.write(JSON.stringify({status: "error", description: "PERM INVALID"}))
				res.end()
			}
			let pl = filename.split("/");
			let patha = "";
			pl.forEach(function(i,a) {
				patha += i + "/";
				fs.mkdir(path.join(folder,`${url}/${patha}`), function(err) {
					if (err) {
						res.statusCode = 411;
						res.end(JSON.stringify({status: "error", description: err.toString()}))
					}
					if (a == pl.length || pl.length == 1) res.end(JSON.stringify({status: "success"}))
				});
			})
			
		});
	}else if (req.url.endsWith("/download|zip")) {
		var url = "";
		var sp = decodeURIComponent(req.url).split("?")[0].split("/");
		sp.forEach(function(itm,i) {
			if (req.url.startsWith("/html") ? i > 1 : i != 0) {
				if (i != sp.length - 1) {
					url += itm + (i == sp.length - 2 ? "" : "/");
				}
			}	
		});
		url = url.replace("/download|zip","");
		const archive = archiver('zip', {
		  zlib: { level: 0 } // Sets the compression level.
		});
		archive.directory(path.join(folder,url),"folder");
		archive.finalize();
		res.writeHead(200, {
			'Content-Disposition': `attachment; filename="Folder.zip"`,
			'Content-Type': "application/zip",
		})
		archive.pipe(res);
		//archive.on('end', function() {
		//	res.end();
		//});
		// var zip = new AdmZip();
		// console.log(path.join(folder,url));
		// zip.addLocalFolder(path.join(folder,url));
		// var zipFileContents = zip.toBuffer();
		// const fileName = 'folder.zip';
		// const fileType = 'application/zip';
		// res.writeHead(200, {
			// 'Content-Disposition': `attachment; filename="${fileName}"`,
			// 'Content-Type': fileType,
		  // })
		// res.end(zipFileContents);
	}else if (req.url.endsWith("/deletefolder") && req.method.toLowerCase() == 'post' && allowwrite) {
		res.setHeader('Content-Type', 'application/json')
		let data = []
		req.on('data', (chunk) => {
			data.push(chunk)
		})
		req.on('end', () => {
			var bd = JSON.parse(data);
			// Try to use the original filename
			let filename = bd['name']
			if (filename == null) {
				res.statusCode = 411;
				res.end(JSON.stringify({status: "error", description: "No Folder Name"}))
				return
			}
			var url = "";
			var sp = decodeURIComponent(req.url).split("?")[0].split("/");
			sp.forEach(function(itm,i) {
				if (req.url.startsWith("/html") ? i > 1 : i != 0) {
					if (i != sp.length - 1) {
						url += itm + (i == sp.length - 2 ? "" : "/");
					}
				}	
			});
			
			if (req.headers.password == rules.adminpassword) {
				allowwrite = true;
			}else {
				var rlf = rules.exceptions[url.replace(folder,"") + (url.includes(folder) ? "/" : "")];
				if (rlf != undefined) {
					allowwrite = rlf.allowwrites;
				}else {
					var isfound = false;
					Object.keys(rules.exceptions).forEach(function(i) {
						var ip = isparent(url.replace(folder,"") + (url.includes(folder) ? "/" : ""), i)
						var rlf = rules.exceptions[i];
						allowwrite = rlf.allowwrites;
						isfound = ip;
					})
					if (!isfound) allowwrite = rules.allowwrites;
				}
			}
			
			if (!allowwrite) {
				res.statusCode = 403;
				res.write(JSON.stringify({status: "error", description: "PERM INVALID"}))
				res.end()
				return;
			}
			
			fs.rm(path.join(folder,`${url}/${filename}`), { recursive: true, force: true },function(err) {
				if (err) {
					res.statusCode = 411;
					res.end(JSON.stringify({status: "error", description: err.toString()}))
					return
				}
				res.end(JSON.stringify({status: "success"}))
			});
		});
	}else if (req.url.endsWith("/copyfile") && req.method.toLowerCase() == 'post' && allowwrite) {
		res.setHeader('Content-Type', 'application/json')
		let data = []
		req.on('data', (chunk) => {
			data.push(chunk)
		})
		req.on('end', () => {
			var bd = JSON.parse(data);
			// Try to use the original filename
			let filename = bd['fromname']
			if (filename == null) {
				res.statusCode = 411;
				res.end(JSON.stringify({status: "error", description: "No Folder Name"}))
				return
			}
			let toname = bd['toname']
			if (toname == null) {
				res.statusCode = 411;
				res.end(JSON.stringify({status: "error", description: "No Folder Name"}))
				return
			}
			var url = "";
			var sp = decodeURIComponent(req.url).split("?")[0].split("/");
			sp.forEach(function(itm,i) {
				if (i != 0) {
					url += itm + (i == sp.length - 1 ? "" : "/");
				}	
			});
			
			if (req.headers.password == rules.adminpassword) {
				allowwrite = true;
			}else {
				var rlf = rules.exceptions[url.replace(folder,"") + (url.includes(folder) ? "/" : "")];
				if (rlf != undefined) {
					allowwrite = rlf.allowwrites;
				}else {
					var isfound = false;
					Object.keys(rules.exceptions).forEach(function(i) {
						var ip = isparent(url.replace(folder,"") + (url.includes(folder) ? "/" : ""), i)
						var rlf = rules.exceptions[i];
						allowwrite = rlf.allowwrites;
						isfound = ip;
					})
					if (!isfound) allowwrite = rules.allowwrites;
				}
			}
			
			if (!allowwrite) {
				res.statusCode = 403;
				res.write(JSON.stringify({status: "error", description: "PERM INVALID"}))
				res.end()
				return;
			}
			
			fs.copyFile(path.join(folder,filename),path.join(folder,toname), fs.constants.COPYFILE_FICLONE,function(err) {
				if (err) {
					res.statusCode = 411;
					res.end(JSON.stringify({status: "error", description: err.toString()}))
					return
				}
				res.end(JSON.stringify({status: "success"}))
			});
		});
	}else if (req.url.endsWith("/copyfolder") && req.method.toLowerCase() == 'post' && allowwrite) {
		res.setHeader('Content-Type', 'application/json')
		let data = []
		req.on('data', (chunk) => {
			data.push(chunk)
		})
		req.on('end', () => {
			var bd = JSON.parse(data);
			// Try to use the original filename
			let filename = bd['fromname']
			if (filename == null) {
				res.statusCode = 411;
				res.end(JSON.stringify({status: "error", description: "No Folder Name"}))
				return
			}
			let toname = bd['toname']
			if (toname == null) {
				res.statusCode = 411;
				res.end(JSON.stringify({status: "error", description: "No Folder Name"}))
				return
			}
			var url = "";
			var sp = decodeURIComponent(req.url).split("?")[0].split("/");
			sp.forEach(function(itm,i) {
				if (i != 0) {
					url += itm + (i == sp.length - 1 ? "" : "/");
				}	
			});
			
			if (req.headers.password == rules.adminpassword) {
				allowwrite = true;
			}else {
				var rlf = rules.exceptions[url.replace(folder,"") + (url.includes(folder) ? "/" : "")];
				if (rlf != undefined) {
					allowwrite = rlf.allowwrites;
				}else {
					var isfound = false;
					Object.keys(rules.exceptions).forEach(function(i) {
						var ip = isparent(url.replace(folder,"") + (url.includes(folder) ? "/" : ""), i)
						var rlf = rules.exceptions[i];
						allowwrite = rlf.allowwrites;
						isfound = ip;
					})
					if (!isfound) allowwrite = rules.allowwrites;
				}
			}
			
			if (!allowwrite) {
				res.statusCode = 403;
				res.write(JSON.stringify({status: "error", description: "PERM INVALID"}))
				res.end()
				return;
			}
			
			console.log(path.join(folder,filename),path.join(folder,toname));
			fs.cp(path.join(folder,filename),path.join(folder,toname), { recursive: true },function(err) {
				if (err) {
					res.statusCode = 411;
					res.end(JSON.stringify({status: "error", description: err.toString()}))
					return
				}
				res.end(JSON.stringify({status: "success"}))
			});
		});
	}else if (req.url.endsWith("/move") && req.method.toLowerCase() == 'post' && allowwrite) {
		res.setHeader('Content-Type', 'application/json')

		// Try to use the original filename
		let data = []
		req.on('data', (chunk) => {
			data.push(chunk)
		})
		req.on('end', () => {
			var bd = JSON.parse(data);
			let filename = bd.fromname
			if (filename == null) {
				res.statusCode = 411;
				res.end(JSON.stringify({status: "error", description: "No Folder Name"}))
				return
			}
			let toname = bd.toname
			if (toname == null) {
				res.statusCode = 411;
				res.end(JSON.stringify({status: "error", description: "No Folder Name"}))
				return
			}
			var url = "";
			var sp = decodeURIComponent(req.url).split("?")[0].split("/");
			sp.forEach(function(itm,i) {
				if (i != 0) {
					url += itm + (i == sp.length - 1 ? "" : "/");
				}	
			});
			
			if (req.headers.password == rules.adminpassword) {
				allowwrite = true;
			}else {
				var rlf = rules.exceptions[url.replace(folder,"") + (url.includes(folder) ? "/" : "")];
				if (rlf != undefined) {
					allowwrite = rlf.allowwrites;
				}else {
					var isfound = false;
					Object.keys(rules.exceptions).forEach(function(i) {
						var ip = isparent(url.replace(folder,"") + (url.includes(folder) ? "/" : ""), i)
						var rlf = rules.exceptions[i];
						allowwrite = rlf.allowwrites;
						isfound = ip;
					})
					if (!isfound) allowwrite = rules.allowwrites;
				}
			}
			
			if (!allowwrite) {
				res.statusCode = 403;
				res.write(JSON.stringify({status: "error", description: "PERM INVALID"}))
				res.end()
				return;
			}
			
			fs.rename(path.join(folder,filename),path.join(folder,toname), function(err) {
				if (err) {
					res.statusCode = 411;
					res.end(JSON.stringify({status: "error", description: err.toString()}))
					return
				}
				res.end(JSON.stringify({status: "success"}))
			});
		})
		
	}else if (req.url.endsWith("/rename") && req.method.toLowerCase() == 'post' && allowwrite) {
		res.setHeader('Content-Type', 'application/json')
		let data = []
		req.on('data', (chunk) => {
			data.push(chunk)
		})
		req.on('end', () => {
			var bd = JSON.parse(data);
			// Try to use the original filename
			let filename = bd['oldname']
			if (filename == null) {
				res.statusCode = 411;
				res.end(JSON.stringify({status: "error", description: "No Folder Name"}))
				return
			}
			let newfilename = bd['newname']
			if (newfilename == null) {
				res.statusCode = 411;
				res.end(JSON.stringify({status: "error", description: "No Folder Name"}))
				return
			}
			var url = "";
			var sp = decodeURIComponent(req.url).split("?")[0].split("/");
			sp.forEach(function(itm,i) {
				if (req.url.startsWith("/html") ? i > 1 : i != 0) {
					if (i != sp.length - 1) {
						url += itm + (i == sp.length - 2 ? "" : "/");
					}
				}
			});
			
			if (req.headers.password == rules.adminpassword) {
				allowwrite = true;
			}else {
				var rlf = rules.exceptions[url.replace(folder,"") + (url.includes(folder) ? "/" : "")];
				if (rlf != undefined) {
					allowwrite = rlf.allowwrites;
				}else {
					var isfound = false;
					Object.keys(rules.exceptions).forEach(function(i) {
						var ip = isparent(url.replace(folder,"") + (url.includes(folder) ? "/" : ""), i)
						var rlf = rules.exceptions[i];
						allowwrite = rlf.allowwrites;
						isfound = ip;
					})
					if (!isfound) allowwrite = rules.allowwrites;
				}
			}
			
			if (!allowwrite) {
				res.statusCode = 403;
				res.write(JSON.stringify({status: "error", description: "PERM INVALID"}))
				res.end()
				return;
			}
			
			fs.rename(path.join(folder,`${url}/${filename}`),path.join(folder,`${url}/${newfilename}`), function(err) {
				if (err) {
					res.statusCode = 411;
					res.end(JSON.stringify({status: "error", description: err.toString()}))
					return
				}
				res.end(JSON.stringify({status: "success"}))
			});
		});
	}else if (req.url.endsWith("/deletefile") && req.method.toLowerCase() == 'post' && allowwrite) {
		res.setHeader('Content-Type', 'application/json')
		let data = []
		req.on('data', (chunk) => {
			data.push(chunk)
		})
		req.on('end', () => {
			var bd = JSON.parse(data);
			// Try to use the original filename
			let filename = bd['name']
			if (filename == null) {
				res.statusCode = 411;
				res.end(JSON.stringify({status: "error", description: "No Folder Name"}))
				return
			}
			var url = "";
			var sp = decodeURIComponent(req.url).split("?")[0].split("/");
			sp.forEach(function(itm,i) {
				if (req.url.startsWith("/html") ? i > 1 : i != 0) {
					if (i != sp.length - 1) {
						url += itm + (i == sp.length - 2 ? "" : "/");
					}
				}
			});
			
			if (req.headers.password == rules.adminpassword) {
				allowwrite = true;
			}else {
				var rlf = rules.exceptions[url.replace(folder,"") + (url.includes(folder) ? "/" : "")];
				if (rlf != undefined) {
					allowwrite = rlf.allowwrites;
				}else {
					var isfound = false;
					Object.keys(rules.exceptions).forEach(function(i) {
						var ip = isparent(url.replace(folder,"") + (url.includes(folder) ? "/" : ""), i)
						var rlf = rules.exceptions[i];
						allowwrite = rlf.allowwrites;
						isfound = ip;
					})
					if (!isfound) allowwrite = rules.allowwrites;
				}
			}
			
			if (!allowwrite) {
				res.statusCode = 403;
				res.write(JSON.stringify({status: "error", description: "PERM INVALID"}))
				res.end()
				return;
			}
			
			fs.unlink(path.join(folder,`${url}/${filename}`), function(err) {
				if (err) {
					res.statusCode = 411;
					res.end(JSON.stringify({status: "error", description: err.toString()}))
					return
				}
				res.end(JSON.stringify({status: "success"}))
			});
		});
	}else if (req.url.endsWith("/checkadminpassword") && req.method.toLowerCase() == 'post') {
		res.statusCode = req.headers.password == rules.adminpassword ? 200 : 403;
		res.write(req.headers.password == rules.adminpassword ? "true" : "false")
		res.end()
	}else {
		try {
			var url = "";
			var sp = decodeURIComponent(req.url).split("?")[0].split("/");
			sp.forEach(function(itm,i) {
				if (i != 0) {
					url += itm + (i == sp.length - 1 ? "" : "/");
				}	
			});
			if (fs.lstatSync(path.resolve(folder, url)).isDirectory()) {
				if (req.method.toLowerCase() == 'post') {
					let data = []
					req.on('data', (chunk) => {
						data.push(chunk)
					})
					req.on('end', () => {
						var formdata = formtojson(data.toString());
						console.log(formdata)
						if (formdata["type"] == "html") {
							repsondwithdir(folder + "/" + url,res,formdata["password"]);
						}else {
							fs.readdir(folder + "/" + url, (err, files) => {
								var dfolders = [];
								var dfiles = [];
								files.forEach(file => {
									try {
										var fpath = path.resolve( path.resolve(folder, url), file );
										if (fs.lstatSync(fpath).isDirectory()) {
											dfolders.push({folder:file});
										}else {
											var stats = fs.statSync(fpath)
											var datem = new Date(stats.mtimeMs)
											var datec = new Date(stats.ctimeMs)
											dfiles.push({
												file:file, 
												size: stats.size, 
												modified: (datem.getMonth() + 1).pad() + " " + datem.getDate().pad() + " " + datem.getFullYear() + ", " + datem.getHours().toString().padStart(2, '0') + ":" + datem.getMinutes().toString().padStart(2, '0') + " " + ((diff<=0?"":"+") + Math.floor(diff / 60).pad().toString() + ":" + Math.floor(diff % 60).pad().toString()), 
												creation: (datec.getMonth() + 1).pad() + " " + datec.getDate().pad() + " " + datec.getFullYear() + ", " + datec.getHours().toString().padStart(2, '0') + ":" + datec.getMinutes().toString().padStart(2, '0') + " " + ((diff<=0?"":"+") + Math.floor(diff / 60).pad().toString() + ":" + Math.floor(diff % 60).pad().toString())
												});
										}
									}catch (e) {
										//res.write(file + " is hidden because:" + e.toString() + "<br>");
									}
								});
								
								res.end(JSON.stringify({folders:dfolders, files:dfiles}));
							});
						}
					})
				}else {
					repsondwithdir(folder + "/" + url,res);
				}
			}else {
				console.time("stat");
				fs.stat(path.resolve(folder, url),(err,stat) => {
					if (err) {
						res.writeHead(500);
						res.end();
						console.error(err);
						return;
					}
					console.timeEnd("stat");
					res.writeHead(200, {
						'Content-Length': stat.size
					});
					delete stat;
					try {
						const readStream = fs.createReadStream(path.resolve(folder, url));

						readStream.on('data', function(chunk) {
							res.write(chunk);
						});
						
						readStream.on('error', function(chunk) {
							res.end();
						});

						readStream.on('end', function() {
							res.end();
							delete readStream;
						});
					}catch (e) {
						res.writeHead(500);
						res.end();
						console.error(e);
					}
				});
			}
		}catch (e) {
			res.writeHead(500);
			res.end(e.toString());
			console.error(e);
		}
	}
}

const server = http.createServer(requestListener);
if (gavecustomargs) {
	server.listen(port,'0.0.0.0');
	readline.close();
}else {
	readline.question('Enter Port: ', prt => {
		port = parseInt(prt);
		readline.question('Folder Path To Share: ', fld => {
			folder = fld;
			readline.question('Rules JSON: ', rpth => {
				var jsondata = JSON.parse(fs.readFileSync(rpth));
				allowwrite = jsondata.allowwrites;
				rules = jsondata;
				server.listen(port,'0.0.0.0');
				readline.close();
			});
		});
	});
}

function isparent(paths,dir) {
	const relative = path.relative(dir, paths);
    return relative && !relative.startsWith('..') && !path.isAbsolute(relative);
}

function formtojson(formstr) {
	var retrn = {};
	var pairs = formstr.split("&");
	pairs.forEach(function (i) {
		var pair = i.split("=");
		retrn[pair[0]] = pair[1];
	})
	return retrn
}
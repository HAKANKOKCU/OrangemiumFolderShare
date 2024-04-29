# OrangemiumFolderShare
Orangemium Folder Share is a Node.JS based server that lets you share folder over http

(please don't forget to type `npm install` before runing)
# Command line parameters
No `=` required before values, just do it like `--port 842`

* `--port`: Lets you select the port
* `--folder`: The folder's path you want to share
* `--rules`: The json file's path that will be used as "rules"

For example; `--port 842 --folder /sharefolder --rules rules.json`

# Rules

```
{
	"adminpassword": "",
	"allowwrites": true,
	"exceptions": {}
}
```

## Exceptions object

```
...
"exceptions": {
  "folder": {
    "allowwrites": true
  }
}
```

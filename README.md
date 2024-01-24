# Python Electron

Experimenting the creation of an electron app with a python backend created using FastAPI

## Tools Used

[**pyinstaller**](https://pyinstaller.org/en/stable/): build binaries for the fastapi backend
[**electron-builder**](https://www.electron.build/index.html): To ease the packaging process of the electron app.

## Run as Developper

You need a python interpreter installed on your computer. The python dependences needs to be installed with:

```
python -m pip install -r requirements.txt
```


You also need to install all the NodeJs dependencies by running

```
npm i 
```

Then you can launch the app with the command :

```
npm run electron-dev
```

## Build the Application

To build the application, you also need to install all the dependencies required to run the app in development mode (see last section).
Once it's done, you can package the app using the command :

```
npm run electron-build
```
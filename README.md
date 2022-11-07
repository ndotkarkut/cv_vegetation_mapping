# React Vegetation Mapper

React Vegetation Mapper is a React-frontend and Node.js / Python-backend web application that uses the Google Maps Javascript API to perform computer vision computations on Google's Street View Imagery.

## Installation

### Google Maps API Key

This software relies on the Google Maps Javascript and Google Maps Streetview APIs to retrieve Google Maps and its data. Therefore it is a requirement for the user to provide a Google Maps API Key upon startup of the application.

The application will either (1) ask for you to input this API Key that you can retrieve following this [Google documentation](https://developers.google.com/maps/documentation/javascript/get-api-key) 


or (2) enter the API Key as an environment variable in a `.env` file as so:

```bash
REACT_APP_GOOGLE_MAPS_API_KEY=YOUR_API_KEY_HERE
```

### Client

Use either yarn or npm to install the necessary packages

```bash
cd client
yarn
```

```bash
cd client
npm install
```

### Server

Use either yarn or npm to install the necessary packages for the Node.js environment

```bash
cd server
yarn
```

```bash
cd server
npm install
```

Be sure to use a Python virtual environment such as [virtualenv](https://docs.python.org/3/library/venv.html#module-venv) to keep all modules independent of all other installed Python packages on your computer.

Use the package manager [pip](https://pip.pypa.io/en/stable/) to install the Python packages required for computer vision computations.

```bash
pip install -r requirements.txt
```

## Usage

### Client

```bash
cd client
npm start
```

### Server

```bash
cd server
npm start
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)

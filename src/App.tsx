import { useState, useEffect } from 'react'
import {Heading, Box} from './styles.js';
import axios from 'axios';
import {FormikProvider, Form, useFormik} from 'formik';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

type Zone = {
  zone_id: number;
  name: string;
}

function getFormattedDate(date) {
  let year = date.getFullYear();
  let month = (1 + date.getMonth()).toString().padStart(2, '0');
  let day = date.getDate().toString().padStart(2, '0');

  return year + '-' + month + '-' + day;
}

function App() {
  const [zones, setZones] = useState<Zone[] | null>(null);
  const [award, setAward] = useState<string>('');
  const [awardsData, setAwardsData] = useState<string>('');
  const [date, setDate] = useState(new Date());
  const [pickZone, setPickZone] = useState<number | null>(null);
  const formik = useFormik({
    initialValues: {select_zone: ''},
  });

  useEffect(() => {
    const fetch = async () => {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/zones`);
      console.log('res data', res.data.data)
      setZones(res.data.data);
    }
    fetch();
  }, []);

const handleSearch = async () => {
    console.log('picj zone', pickZone)
    const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/awards?date=${getFormattedDate(date)}` + (pickZone ? `&zone=${pickZone}` : ''));
    console.log('res data after search', res.data)
    setAwardsData(JSON.stringify(res.data.data));
};

const handleChange = async (e) => {
    const zone = JSON.parse(e.target.value);
    const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/awards/${zone.zone_id}`);
    setAward(JSON.stringify(res.data[zone.zone_id]));
}

const handleSelectDate = (val) => {
  setDate(val);
  console.log('val', getFormattedDate(val));
}
  return (
    <div>
      <Heading>Available zones: </Heading>
      {zones && zones.map((zone, index) => {
        return <p key={index}>{zone[index + 1].name}</p> //index + 1 is a workaround (bug in the api)
      })}
      <FormikProvider value={formik}>
      <Form>
      <select name="select_zone" onChange={handleChange} onBlur={formik.handleBlur}>
            {zones && zones.map((zone, index) => {
                return <option key={index} value={JSON.stringify(zone[index + 1])}>{zone[index + 1].name}</option> //index + 1 is a workaround (bug in the api)
            })}
            </select>
        </Form>
      </FormikProvider>
      <Heading>Award for the selected zone:</Heading>
      <Box>{award || 'Not selected yet'}</Box>
      <span>
        Please, pick a date: <DatePicker selected={date} onSelect={handleSelectDate} />
        Please, pick a zone:
        <select onChange={(e) => e.target.value !== 'all ' ? setPickZone(e.target.value) : setPickZone(null)}>
          <option>all</option>
          <option>1</option>
          <option>2</option>
          <option>3</option>
          <option>4</option>
          <option>5</option>
        </select>
        <button onClick={handleSearch}>search</button>
      </span>
      <div>Results: {awardsData}</div>
    </div>
  )
}

export default App

import React from "react";
import axios from "axios";

// PUBLIC KEY
const API__KEY = process.env.REACT_APP_NASA_API_URL || "DEMO_KEY";

const DAYS_OF_WEAK = [
	"lunes",
	"martes",
	"miércoles",
	"jueves",
	"viernes",
	"sábado",
	"domingo",
];
const ARRAY_MONTH = [
	"enero",
	"febrero",
	"marzo",
	"abril",
	"mayo",
	"junio",
	"julio",
	"agosto",
	"septiembre",
	"octubre",
	"noviembre",
	"diciembre",
];

const SIZE_CALENDAR = 42;
const CALENDAR_DAYS = Array.from({ length: SIZE_CALENDAR }, (_, k) => k++).map(
	(k) => k + 1
);
const theFirstDayName = (year, month) =>
	new Date(year, month).toLocaleDateString("ES-es", { weekday: "long" });
const theLastDayNumber = (year, month) => new Date(year, month, 0).getDate();

function App() {
	const [year, setYear] = React.useState(2019);
	const [month, setMonth] = React.useState(5);
	const [day, setDay] = React.useState(8);
	const [pictures, setPictures] = React.useState([]);

	React.useEffect(async () => {
		const { data, error } = await axios.get(
			`https://api.nasa.gov/EPIC/api/natural/date/${year}-${
				month + 1 < 10 ? `0${month + 1}` : month + 1
			}-${day < 10 ? `0${day}` : day}?api_key=${API__KEY}`
		);
		if (error) console.error(error) ;
		setPictures(data);
	}, [year, day, month]);

	console.log(theFirstDayName(year, month));
	return (
		<div className="App">
			<div>
				<div className="title">
					<h2>NASA EPIC APP</h2>
				</div>
				<div className="app-container" alt="calendar">
					<Calendar
						year={year}
						day={day}
						month={month}
						setDay={setDay}
						setMonth={setMonth}
						setYear={setYear}
					/>
					<EpicPictures
						pictures={pictures}
						day={day}
						year={year}
						month={month}
					/>
				</div>
			
			</div>
			<span Style={{
	textAlign: 'center',
    display: 'block',
    color: 'white',
    paddingBottom: '10px'
	}}>this app use https://api.nasa.gov/ public key</span>
		</div>
	);
}

const Calendar = ({ year, month, day, setDay, setMonth, setYear }) => {
	let days_of_month = 0;
	let days_of_after_month = 0;
	let days_of_before_month = 0;
	const theLastDayOfPastMonth = theLastDayNumber(year, month);
	return (
		<div className="calendar">
			<div className="calendar--years--month">
				<div
					className="arrows left"
					onClick={() =>
						changeTheMonth(
							{ year: year, month: month, newMonth: -1 },
							setYear,
							setMonth
						)
					}
				>
					{" "}
					&#9204;
				</div>
				<span>
					{year} - {ARRAY_MONTH[month]}
				</span>
				<div
					className="arrows right"
					onClick={() =>
						changeTheMonth(
							{
								year: year,
								month: month,
								newMonth: 1,
							},
							setYear,
							setMonth
						)
					}
				>
					{" "}
					&#9205;
				</div>
			</div>
			<div className="calendar--days--of--weak">
				{/* WE PRINT DAYS OF WEAK */}
				{DAYS_OF_WEAK.map((day_of_week, k) => (
					<div key={k} className="calendar--days--of--weak--day">
						{day_of_week}
					</div>
				))}
			</div>
			{/* WE PRINT EVERY DAY */}
			<div className="calendar--days">
				{CALENDAR_DAYS.map((dayI, index) => {
					// 	WE PRINT THE DAY BEFORE THE CURRENT MONTH OF APP
					if (DAYS_OF_WEAK.indexOf(theFirstDayName(year, month)) + 1 > dayI) {
						console.log(
							theLastDayOfPastMonth,
							DAYS_OF_WEAK.indexOf(theFirstDayName(year, month)) + 1,
							index
						);
						days_of_before_month =
							theLastDayOfPastMonth -
							(DAYS_OF_WEAK.indexOf(theFirstDayName(year, month)) - 2) -
							1;

						return (
							<div className="calendar--days--day desactivate" key={index}>
								<span> {days_of_before_month + index} </span>
							</div>
						);
					}

					// WE PRINT THE DAY OF THE CURRENT MONTH OF APP
					if (
						DAYS_OF_WEAK.indexOf(theFirstDayName(year, month)) + 1 <= dayI &&
						days_of_month < theLastDayNumber(year, month + 1)
					) {
						days_of_month++;
						return (
							<div
								value={days_of_month}
								onClick={(e) => setDay(parseInt(e.target.textContent))}
								className={`calendar--days--day ${
									days_of_month === day ? "active" : ""
								}`}
							>
								<span>{days_of_month}</span>
							</div>
						);
					}
					// WE PRINT THE DAY AFTER THE CURRENT MONTH OF APP
					days_of_after_month++;
					return (
						<div className="calendar--days--day desactivate" key={index}>
							<span> {days_of_after_month} </span>
						</div>
					);
				})}
			</div>
		</div>
	);
};

const EpicPictures = ({ pictures, year, month, day }) => {
	const URL_PICTURE = (years, months, days, picture) =>
		`https://api.nasa.gov/EPIC/archive/natural/${years}/${
			months + 1 < 10 ? `0${months + 1}` : months + 1
		}/${days < 10 ? `0${days}` : days}/png/${picture}.png?api_key=${API__KEY}`;
		console.log(pictures)
	return (
		<div className="epic-container">
			<div className="epic-pictures">

				{
				pictures && pictures.length > 0 ?  
				pictures.map((pic, k) => {
					return (
						<div className="epic-pictures--picture" key={k}>
							<a href={URL_PICTURE(year, month, day, pic.image)}>
								<img src={URL_PICTURE(year, month, day, pic.image)} alt="" />
							</a>
						</div>
					);
				}):
				( 
					<span> Oh! in this day we dont have pictures yet :(</span>
				)
					}
			</div>
		</div>
	);
};

const changeTheMonth = (date, setYear, setMonth) => {
	if (date.month + date.newMonth >= 12) {
		setMonth(0);
		setYear(date.year + 1);
		return;
	}
	if (date.month + date.newMonth <= 0) {
		setMonth(11);
		setYear(date.year - 1);
		return;
	}
	setMonth(date.month + date.newMonth);
};

export default App;

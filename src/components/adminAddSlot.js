import React, { useState, useEffect } from 'react';
import { API_URL } from '../api';

function AdminSlots() {
    const [time, setTime] = useState('');
    const [date, setDate] = useState('');
    const [movieId, setMovieId] = useState('');
    const [screenId, setScreenId] = useState('');
    const [theatreId, setTheatreId] = useState('');
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [classPrices, setClassPrices] = useState([]);

    const [theatreMap, setTheatreMap] = useState({});
    const [screenOptions, setScreenOptions] = useState([]);
    const [movieOptions, setMovieOptions] = useState([]);

    // Fetch theatres on component mount
    useEffect(() => {
        const fetchTheatres = async () => {
            try {
                const response = await fetch(API_URL+'/theatres');
                const data = await response.json();
                const theatres = {};
                data.forEach(theatre => {
                    theatres[theatre._id] = theatre.theatrename;
                });
                setTheatreMap(theatres);
            } catch (error) {
                console.error('Error fetching theatres:', error);
            }
        };

        fetchTheatres();
    }, []);

    // Handle theatre selection and fetch corresponding screens
    const handleTheatreChange = async (e) => {
        const selectedTheatreId = e.target.value;
        setTheatreId(selectedTheatreId);
        setScreenId('');
        setMovieId('');
        setMovieOptions([]);
        setClassPrices([]);

        if (selectedTheatreId) {
            try {
                const response = await fetch(API_URL+`/screensQuery?theatreId=${selectedTheatreId}`);
                const data = await response.json();
                setScreenOptions(data);
            } catch (error) {
                console.error('Error fetching screens:', error);
            }
        } else {
            setScreenOptions([]);
        }
    };

    // Handle screen selection and fetch class information
    const handleScreenChange = async (e) => {
        const selectedScreenId = e.target.value;
        setScreenId(selectedScreenId);
        setMovieId('');
        setClassPrices([]);

        if (theatreId && selectedScreenId) {
            try {
                const response = await fetch(API_URL+`/screens/${selectedScreenId}`);
                const screenData = await response.json();
                const classes = screenData.classInfo.map(classInfo => ({
                    className: classInfo.className,
                    classNo: classInfo.classNo,
                    price: 0 // Initialize price as 0
                }));
    
                setClassPrices(classes);

                const movieResponse = await fetch(API_URL+`/moviesByTS?theatreId=${theatreId}`);
                const movieData = await movieResponse.json();
                setMovieOptions(movieData);
            } catch (error) {
                console.error('Error fetching screen or movie data:', error);
            }
        } else {
            setMovieOptions([]);
        }
    };

    const handleClassPriceChange = (index, value) => {
        setClassPrices((prevPrices) =>
            prevPrices.map((classPrice, i) =>
                i === index ? { ...classPrice, price: parseFloat(value) } : classPrice
            )
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const slotData = {
            time,
            date,
            movieId,
            screenId,
            theatreId,
            selectedSeats,
            classPrices
        };

        try {
            const response = await fetch(API_URL+'/slots', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(slotData),
            });

            if (!response.ok) throw new Error('Failed to add slot');

            // Clear form after successful submission
            setTime('');
            setDate('');
            setMovieId('');
            setScreenId('');
            setTheatreId('');
            setSelectedSeats([]);
            setClassPrices([]);

            alert('Slot details added successfully!');
        } catch (error) {
            console.error('Error adding slot:', error);
            alert('Failed to add slot: ' + error.message);
        }
    };

    return (
        <div id="admin-slots" className="admin-card">
            <div className="admin-title">Add Slot</div>
            <form className="admin-form" onSubmit={handleSubmit}>
                <label htmlFor="admin-timeNew">Time:</label>
                <input
                    type="text"
                    id="admin-timeNew"
                    placeholder="Format: Time<space>AM/PM"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                />

                <label htmlFor="admin-dateNew">Date:</label>
                <input
                    type="date"
                    id="admin-dateNew"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />

                <label htmlFor="admin-theatreIdNew">Theatre:</label>
                <select
                    id="admin-theatreIdNew"
                    value={theatreId}
                    onChange={handleTheatreChange}
                    required
                >
                    <option value="">Select a theatre</option>
                    {Object.keys(theatreMap).map(id => (
                        <option key={id} value={id}>
                            {theatreMap[id]}
                        </option>
                    ))}
                </select>

                <label htmlFor="admin-screenIdNew">Screen:</label>
                <select
                    id="admin-screenIdNew"
                    value={screenId}
                    onChange={handleScreenChange}
                    required
                    disabled={!theatreId}
                >
                    <option value="">Select a screen</option>
                    {screenOptions && screenOptions.map(screen => (
                        <option key={screen._id} value={screen._id}>
                            Screen {screen.screenNo}
                        </option>
                    ))}
                </select>

                <label htmlFor="admin-movieIdNew">Movie:</label>
                <select
                    id="admin-movieIdNew"
                    value={movieId}
                    onChange={(e) => setMovieId(e.target.value)}
                    required
                    disabled={!screenId}
                >
                    <option value="">Select a movie</option>
                    {movieOptions && movieOptions.map(movie => (
                        <option key={movie._id} value={movie._id}>
                            {movie.title}
                        </option>
                    ))}
                </select>

                <div>
                    <h4>Class Prices:</h4>
                    {classPrices.map((classPrice, index) => (
                        <div key={index} className="class-price-group">
                            <label>
                                Class Name: {classPrice.className}
                            </label>
                            <label>
                                Class No: {classPrice.classNo}
                            </label>
                            <input
                                type="number"
                                placeholder="Enter Price"
                                value={classPrice.price}
                                onChange={(e) =>
                                    handleClassPriceChange(index, e.target.value)
                                }
                                required
                            />
                        </div>
                    ))}
                </div>

                <button type="submit">Add Slot</button>
            </form>
        </div>
    );
}

export default AdminSlots;

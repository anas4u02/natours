const fs = require("fs");
const { log } = require("console");
tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));
exports.getAllTours = (req, res) => {
    log(req.requestTime);
    res.status(200).json({
        createdAt: req.requestTime,
        status: 'success',
        results: tours.length,
        data: {
            tours
        }
    });
}
exports.getOneTour = (req, res) => {
    const id = req.params.id * 1;
    const tour = tours.find(el => el.id === id);

    if (!tour) {
        return res.status(404).json({
            message: 'No data found for the ID'
        });
    }
    res.status(200).json(
        {
            createdAt: req.requestTime,
            status: 'success',
            data: {
                tour
            }
        });
}

exports.addTour = (req, res) => {
    const newId = tours[tours.length - 1] + 1;
    const newTour = Object.assign({ id: newId }, req.body);
    tours.push(newTour);
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });
    });

    console.log(req.body);
}

exports.patchTour = (req, res) => {
    const id = req.params.id * 1;
    if (id > tours.length) {
        return res.status(404).json({
            message: 'Invalid ID'
        });
    }

    const tour = tours.find(el => el.id === id);
    // fs does not support anything similar to PATCH request, that's why it's 
    // not implemented here

    res.status(200).json({
        status: 'success',
        data: {
            tour: 'Updated tour here'
        }
    });
}

exports.deleteTour = (req, res) => {
    const id = req.params.id * 1;
    if (id > tours.length) {
        res.status(401).json({
            status: 'fail',
            message: "Tour not found"
        });
    }

    res.status(200).json({
        status: 'success',
        data: null
    });
}
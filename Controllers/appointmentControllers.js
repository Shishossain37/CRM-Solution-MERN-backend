const Appointment = require("../models/appointmentSchema");

// add appointment
exports.appointmentPost = async (req, res) => {
    // console.log(req.body);
    const { name, date, time, regard } = req.body;
    try {
        const appointment = new Appointment({ name, date, time, regard });
        await appointment.save();
        res.status(201).json(appointment);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: 'Invalid data provided', error });
    }
};


exports.appointmentGet = async (req, res) => {
    const search = req.query.search || "";
    const page = req.query.page || 1;
    const ITEM_PER_PAGE = 4;
    const { selectedMonth, selectedYear } = req.query;
    let query = {
        name: { $regex: search, $options: "i" }
    };
    if (selectedMonth && selectedYear) {
        query.date = {
            $gte: new Date(selectedYear, selectedMonth - 1, 1),   // Start of the selected month
            $lte: new Date(selectedYear, selectedMonth - 1, 31, 23, 59, 59)  // End of the selected month
        };
    }
    try {
        const skip = (page - 1) * ITEM_PER_PAGE;
        const count = await Appointment.countDocuments(query);
        const appointmentData = await Appointment.find(query)
            .limit(ITEM_PER_PAGE)
            .skip(skip);
        const pageCount = Math.ceil(count / ITEM_PER_PAGE);

        res.status(200).json({
            Pagination: {
                count,
                pageCount
            },
            appointmentData
        });
    } catch (error) {
        res.status(500).json(error);
    }
};


// single appointment get
exports.singleappointmentget = async (req, res) => {

    const { id } = req.params;

    try {
        const appointmentData = await Appointment.findOne({ _id: id });
        res.status(200).json(appointmentData)
    } catch (error) {
        res.status(401).json(error)
    }
}

// edit appointment
exports.appointmentEdit = async (req, res) => {
    const { id } = req.params;
    const { name, date, time, regard } = req.body;
    try {
        const appointment = await Appointment.findByIdAndUpdate({ _id: id }, { name, date, time, regard }, { new: true });
        if (!appointment) {
            return res.status(404).json({ error: 'Event not found' });
        }
        await appointment.save()
        res.json(appointment);
    } catch (error) {
        res.status(400).json({ error: 'Invalid data provided', error });
    }

}

// delete appointment
exports.appointmentDelete = async (req, res) => {
    const { id } = req.params;
    try {
        const deleteappointment = await Appointment.findByIdAndDelete({ _id: id });
        res.status(200).json(deleteappointment);
    } catch (error) {
        res.status(401).json(error)
    }
}


const Event = require("../../models/event");
const User = require("../../models/event");
const { dateToString } = require("../../helpers/date");

const transformEvent = async (event) => {
  // console.log("EVENT:", event._doc);
  const thisCreator = await findUser(event._doc.creator);
  return {
    ...event._doc,
    creator: thisCreator,
    date: dateToString(event._doc.date),
  };
};

const transformBooking = (booking) => {
  return {
    ...booking._doc,
    user: findUser.bind(this, booking._doc.user),
    event: findEvent.bind(this, booking._doc.event),
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt),
  };
};

const findEvents = async (eventIds) => {
  try {
    const foundEvents = await Event.find({ _id: { $in: eventIds } });
    return foundEvents.map((event) => {
      return transformEvent(event);
    });
  } catch (err) {
    throw err;
  }
};

const findEvent = async (eventId) => {
  try {
    const foundEvent = await Event.findById(eventId);
    return transformEvent(foundEvent);
  } catch (err) {
    throw err;
  }
};

const findUser = async (userId) => {
  console.log("HERE:", `findUser called with ${userId}`);
  try {
    const foundUser = await User.findById(userId);
    // console.log("CREATOR HERE", `${foundUser}`);
    return {
      ...foundUser._doc,
      createdEvents: findEvents.bind(this, foundUser._doc.createdEvents),
    };
  } catch (err) {
    throw err;
  }
};

// exports.findUser = findUser;
// exports.findEvents = findEvents;
// exports.findEvent = findEvent;
exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;

const Event = require("../../models/event");
const User = require("../../models/user");
const { transformEvent } = require("./merge");

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      const transformedEvents = await Promise.all(
        events.map(async (event) => {
          const transformedEvent = await transformEvent(event);
          console.log("MAPPED EVENT:", transformedEvent);
          return transformedEvent;
        })
      );
      return transformedEvents;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  createEvent: async (args) => {
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: "6643462ccd8522d297ec659e",
    });
    try {
      const result = await event.save();
      const eventCreator = await User.findById("6643462ccd8522d297ec659e");
      // console.log(eventCreator);
      eventCreator.createdEvents.push(event);
      eventCreator.save();
      return transformEvent(result);
    } catch (err) {
      throw err;
    }
  },
};

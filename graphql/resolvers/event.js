const Event = require("../../models/event");
const { transformEvent } = require("./merge");

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map((event) => {
        return transformEvent(event);
      });
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
      creator: "664346ba08be3a714f80341d",
    });
    try {
      const result = await event.save();
      const eventCreator = await User.findById("664346ba08be3a714f80341d");
      eventCreator.createdEvents.push(event);
      eventCreator.save();
      return transformEvent(result);
    } catch (err) {
      throw err;
    }
  },
};

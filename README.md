# Websocket Pub/Sub Chat Exercise

This exercise is designed to explain and explore the Pub/Sub (publisher/subscriber) pattern - one of the major event-based architecture patterns in use in multiple systems. Several of the systems that are in use with React and Socket.io actually implement the Pub/Sub pattern, especially with handling UI and network events.

The gist of the Pub/Sub pattern is the idea of the "message dispatch", where a central piece of code receives messages from other parts of the system - the publishers -, and relays those messages to other parts of the system - the subscribers - based on rules about those messages. Usually the messages are separated by "channels" or "types" - a text message between two users has a different "channel" than a message in a general board, and name changes are also a different "type" of message.

So the plan is to implement a simple message board, kind of like a mini Whatsapp/Signal, where people can know who is online, send messages to the group and send private messages to each other. The basic websocket (socket.io) connection is already implemented, what is remaining is to implement the messaging system in the server and in the client.

One suggested plan, open to revision:
- [ ] implement sending messages to the main group
- [ ] implement receiving messages from the main group (there already is a reducer working for that)
- [ ] implement changing names of users
  - [ ] implement identifying messages by their users
- [ ] implement sending messages between users
- [ ] implement different groups/message channels

Extra goals:
- [ ] implement message timestamping
- [ ] implement admin/moderation controls
  - [ ] implement removing messages
    - [ ] implement removing messages _only if you are allowed to_ (i.e.: the original user or an admin)
  - [ ] implement mute/block
  - [ ] implement banning of users
- [ ] implement group messaging
  - [ ] implement adding and removing users from groups dynamically
- [ ] implement image messages (that would be interesting!)

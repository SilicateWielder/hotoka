# hotoka
A personal discord bot that I've written for use in my own discord server. This is primarily meant to be a private-use bot for now, though I may allow other people to use it in the future.

For now it's quite basic, and I'm primarily focusing on the core architecture for the bot so that it's easily expandable and I can avoid the pitfalls I ran into with Guildleus/Guildmeister.

## Roadmap

 - Module functionality (Pending)
 - Database module (Pending)



## Planned rendering pipeline

With this feasibility test I'm exploring the potential of dynamic 2D-assets. This will be handled by the "Lithophane" pre-rendering engine which will allow for assets to be pre-rendered into 2d textures that can then be billboarded onto the game map. By default I plan to have four angles of visibility for players, but with the intention of allowing for users to increase this to what their particular system can handle. If this setting is changed then Lithophane will have to do a set of batch-rendering to create the necessary assets. I do not plan to allow on-the-fly asset generation at this time.

1. 3D Model > 2. Litohphane > 3. Lighting Stage > 4. Billboarding Stage (Stages 3 and 4 will occur in a loop)

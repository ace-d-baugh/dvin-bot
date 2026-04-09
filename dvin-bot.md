# D'VIN Bot

## A Discord Bot

### Summary

D'VIN (Disney's Very Important Notifications) is a bot for Discord that calls to the Theme Parks Wiki found here: https://themeparks.wiki/api and returns accurate closures of Walt Disney World Attractions every 60 seconds.

### How It Works

The call to the API will be done in a try catch so if it fails the bot doesn't die. It calls every 60 seconds and runs some logic to produce a message to the discord server that the bot has been added to. There will be some way to keep track of the previous call (possibly a JSON file) so the bot can compare the old data with the new to see what attractions have closed or resumed operation. This is not for all attractions as we will exclude Blizzard Beach and Typhoon Lagoon from any API calls and certain attractions that do not need to be monitored (see data below). At the top of each channel for the four parks at Walt Disney World, there will be a pinned message. The pinned message will have two tables of data, the emoji and park name, the hours of operation, and the status of the park. Below that will be the list of attractions and their status. See Below for examples of pinned messages.  
When a park opens for the day, The pinned m,essage will be updated and a message will be sent out with the park name/emoji, the 🚀 emoji and the code 108. When an attraction goes from operating to closed during operating hours, the pinned message will be updated and a message will be sent out with that attraction name, the ❌ emoji, and the code 101. See the example below. If an attraction becomes operational during park hours, the bot will update the pinned message and send a message of that attraction's name, the 🟢 emoji, and the code 102. See the example below. This way the users are aware of the attraction opening back up.  
The bot only references the standby lines for the attraction and none of the single rider lines as those may or not be up at the time.  
Other factors to consider:  
- If the call fails, the bot will wait for the next 60 second interval and try again instead of spamming the API. 
- All attractions in the stored data file start with the base status of closed and a code associated with it as 107 (closed for the day). It will also have a "lastChanged" value of midnight January 1, 2000. 
- No notifications will be sent before or after park hours. 
- Once a park opens, the bot will change the pinned message of the park and only the attractions that also became operational, and the lastChange time stamp will change to the time of the call and a notification will be sent with the list of all attractions, the 🟢 emoji, and the code 102. 
- Once a park closes for the day, the bot will alter the information in the pinned message. It will show the park as closed for the day with the 🚫 emoji and all the attractions will have a status of closed, a ❌ emoji, and a code of 107, and the lastChange time stamp will change to the time of the call. A notification will be sent with the park name/emoji, the 🚫 emoji, and the code 107 to signify the end of day for that park.
- The pinned message will be updated every 60 seconds. See belwo for the example of the pinned messages. The attractions are in alphabetical order by their short name and in two columns for easy reading. Simple park emoji, short park name, hours of operation, and status of park. The attractions part will be comprised of the attraction name, and the status emoji.
- The messages are simply the time of the status update on the first line. On the second and subsequent lines the info goes like this: the park emoji, the short park name, and the status emoji and the code. See the example below.
- Text of the attractions in the pinned message will be bold and Red to draw attention to them. The regular text will be black on a white background. or white on a black background if they have dark mode on.
- Each park has a custom emoji that is used to represent the park. See below for the discord code for each park.

---
### Simplified Codes: To make messages more succinct

- MK = Magic Kingdom
- EP = Epcot
- HS = Disney's Hollywood Studios
- AK = Disney's Animal Kingdom
---
- 101 = Attraction going from operating to closed but during normal park operating hours
- 102 = Attraction going from closed to operating but during normal park operating hours
- 107 = Park or attraction closed for the day
- 108 = Park open for the day
---
### Examples of messages

"07:30 AM:  
🦁AK - 🚀108"

"10:00 AM:  
🏰MK - Dumbo - ❌101"

"10:06 AM:  
🎬HS - Rise - ❌101"

"10:15 AM:  
🎬HS - Rise - 🟢102"

"10:20 AM:  
🏰MK - Dumbo - 🟢102"

"21:00 PM:  
🌐 EP - 🚫 107"

---
### DATA

https://api.themeparks.wiki/v1/entity/e957da41-3552-4cf6-b636-5babc5cbc4e5/live

#### Parks

- name: Magic Kingdom
   - shortName: MK
   - id: 75ea578a-adc8-4116-a54d-dccb60765ef9
   - status: closed
   - code: 107
   - lastChanged: {dateTime}
- name: Epcot
   - shortName: EP
   - id: 47f90d2c-e191-4239-a466-5892ef59a88b
   - status: closed
   - code: 107
   - lastChanged: {dateTime}
- name: Disney's Hollywood Studios
   - shortName: HS
   - id: 288747d1-8b4f-4a64-867e-ea7c9b27bad8
   - status: closed
   - code: 107
   - lastChanged: {dateTime}
- name: Disney's Animal Kingdom
   - shortName: AK
   - id: 1c84a229-8862-4648-9c71-378ddd2c7693
   - status: closed
   - code: 107
   - lastChanged: {dateTime}

#### MK

- name: Astro Orbiter
   - shortName: Astro Orbiter
   - id: d9d12438-d999-4482-894b-8955fdb20ccf
   - status: closed
   - code: 107
   - lastChanged: {dateTime}
- name: Big Thunder Mountain Railroad
   - shortName: Big Thunder
   - id: de3309ca-97d5-4211-bffe-739fed47e92f
   - status: closed
   - code: 107
   - lastChanged: {dateTime}
- name: Buzz Lightyear's Space Ranger Spin
   - shortName: Buzz
   - id: 72c7343a-f7fb-4f66-95df-c91016de7338
   - status: closed
   - code: 107
   - lastChanged: {dateTime}
- name: Country Bear Musical Jamboree
   - shortName: Country Bears
   - id: 0f57cecf-5502-4503-8bc3-ba84d3708ace
   - status: closed
   - code: 107
   - lastChanged: {dateTime}
- name: Dumbo the Flying Elephant
   - shortName: Dumbo
   - id: 890fa430-89c0-4a3f-96c9-11597888005e
   - status: closed
   - code: 107
   - lastChanged: {dateTime}
- name: Enchanted Tales with Belle
   - shortName: Enchanted Tales
   - id: e76c93df-31af-49a5-8e2f-752c76c937c9
   - status: closed
   - code: 107
   - lastChanged: {dateTime}
- name: Haunted Mansion
   - shortName: Mansion
   - id: 2551a77d-023f-4ab1-9a19-8afec0190f39
   - status: closed
   - code: 107
   - lastChanged: {dateTime}
- name: it's a small world
   - shortName: small world
   - id: f5aad2d4-a419-4384-bd9a-42f86385c750
   - status: closed
   - code: 107
   - lastChanged: {dateTime}
- name: Jungle Cruise
   - shortName: Jungle
   - id: 796b0a25-c51e-456e-9bb8-50a324e301b3
   - status: closed
   - code: 107
   - lastChanged: {dateTime}
- name: Mad Tea Party
   - shortName: Tea Cups
   - id: 0aae716c-af13-4439-b638-d75fb1649df3
   - status: closed
   - code: 107
   - lastChanged: {dateTime}
- name: Mickey's PhilharMagic
   - shortName: Philhar
   - id: 7c5e1e02-3a44-4151-9005-44066d5ba1da
   - status: closed
   - code: 107
   - lastChanged: {dateTime}
- name: Monsters Inc. Laugh Floor
   - shortName: Laugh Floor
   - id: e8f0b426-7645-4ea3-8b41-b94ae7091a41
   - status: closed
   - code: 107
   - lastChanged: {dateTime}
- name: Peter Pan's Flight
   - shortName: Pan
   - id: 86a41273-5f15-4b54-93b6-829f140e5161
   - status: closed
   - code: 107
   - lastChanged: {dateTime}
- name: Pirates of the Caribbean
   - shortName: Pirates
   - id: 352feb94-e52e-45eb-9c92-e4b44c6b1a9d
   - status: closed
   - code: 107
   - lastChanged: {dateTime}
- name: Prince Charming Regal Carrousel
   - shortName: Carrousel
   - id: 273ddb8d-e7b5-4e34-8657-1113f49262a5
   - status: closed
   - code: 107
   - lastChanged: {dateTime}
- name: Seven Dwarfs Mine Train
   - shortName: Mine Train
   - id: 9d4d5229-7142-44b6-b4fb-528920969a2c
   - status: closed
   - code: 107
   - lastChanged: {dateTime}
- name: Space Mountain
   - shortName: Space Mtn
   - id: b2260923-9315-40fd-9c6b-44dd811dbe64
   - status: closed
   - code: 107
   - lastChanged: {dateTime}
- name: Swiss Family Treehouse
   - shortName: Treehouse
   - id: 30fe3c64-af71-4c66-a54b-aa61fd7af177
   - status: closed
   - code: 107
   - lastChanged: {dateTime}
- name: The Barnstormer
   - shortName: Barnstormer
   - id: 924a3b2c-6b4b-49e5-99d3-e9dc3f2e8a48
   - status: closed
   - code: 107
   - lastChanged: {dateTime}
- name: The Hall of Presidents
   - shortName: Hall of Pres.
   - id: 2ebfb38c-5cb5-4de1-86c0-f7af14188022
   - status: closed
   - code: 107
   - lastChanged: {dateTime}
- name: The Magic Carpets of Aladdin
   - shortName: Carpets
   - id: 96455de6-f4f1-403c-9391-bf8396979149
   - status: closed
   - code: 107
   - lastChanged: {dateTime}
- name: The Many Adventures of Winnie the Pooh
   - shortName: Pooh
   - id: 0d94ad60-72f0-4551-83a6-ebaecdd89737
   - status: closed
   - code: 107
   - lastChanged: {dateTime}
- name: Tiana's Bayou Adventure
   - shortName: Tiana
   - id: 73cb9445-0695-47a3-87ce-d08ae36b5f3c
   - status: closed
   - code: 107
   - lastChanged: {dateTime}
- name: Tomorrowland Speedway
   - shortName: Speedway
   - id: f163ddcd-43e1-488d-8276-2381c1db0a39
   - status: closed
   - code: 107
   - lastChanged: {dateTime}
- name: Tomorrowland Transit Authority PeopleMover
   - shortName: PeopleMover
   - id: ffcfeaa2-1416-4920-a1ed-543c1a1695c4
   - status: closed
   - code: 107
   - lastChanged: {dateTime}
- name: TRON Lightcycle / Run
   - shortName: TRON
   - id: 5a43d1a7-ad53-4d25-abfe-25625f0da304
   - status: closed
   - code: 107
   - lastChanged: {dateTime}
- name: Under the Sea - Journey of The Little Mermaid
   - shortName: Mermaid
   - id: 3cba0cb4-e2a6-402c-93ee-c11ffcb127ef
   - status: closed
   - code: 107
   - lastChanged: {dateTime}
- name: Walt Disney World Railroad - Fantasyland
   - shortName: Fantasyland Station
   - id: e40ac396-cbac-43f4-8752-764ed60ccceb
   - status: closed
   - code: 107
   - lastChanged: {dateTime}
- name: Walt Disney World Railroad - Main Street, U.S.A.
   - shortName: Main Street Station
   - id: e39b831b-7731-49bb-815b-289b4f49a9fd
   - status: closed
   - code: 107
   - lastChanged: {dateTime}
- name: Walt Disney's Carousel of Progress
   - shortName: Carousel of Progress
   - id: 8183f3f2-1b59-4b9c-b634-6a863bdf8d84
   - status: closed
   - code: 107
   - lastChanged: {dateTime}
- name: Walt Disney's Enchanted Tiki Room
   - shortName: Tiki
   - id: 6fd1e225-53a0-4a80-a577-4bbc9a471075
   - status: closed
   - code: 107
   - lastChanged: {dateTime}

---

#### EP

- name: Beauty and the Beast Sing-Along
   - shortName: B&B Sing Along
   - id: 8c8cd77d-97f6-4309-b285-42aad90e9f15
   - status: closed
   - code: 107
   - lastChanged: {dateTime}
- name: Canada Far and Wide in Circle-Vision 360
   - shortName: Canada 360
   - id: 61fb49f8-e62f-4e1c-ae0e-8ab9929037bc
   - status: closed
   - code: 107
   - lastChanged: {dateTime}
- name: Disney and Pixar Short Film Festival
   - shortName: Pixar Shorts
   - id: 35ed719b-f7f0-488f-8346-4fbf8055d373
   - status: closed
   - code: 107
   - lastChanged: {dateTime}
- name: Frozen Ever After
   - shortName: Frozen
   - id: 8d7ccdb1-a22b-4e26-8dc8-65b1938ed5f0
   - status: closed
   - code: 107
   - lastChanged: {dateTime}
- name: Gran Fiesta Tour Starring The Three Caballeros
   - shortName: Gran Fiesta
   - id: 22f48b73-01df-460e-8969-9eb2b4ae836c
   - status: closed
   - code: 107
   - lastChanged: {dateTime}
- name: Guardians of the Galaxy: Cosmic Rewind
   - shortName: Guardians
   - id: e3549451-b284-453d-9c31-e3b1207abd79
   - status: closed
   - code: 107
   - lastChanged: {dateTime}
- name: Impressions de France
   - shortName: Impressions
   - id: 00666fe9-7774-4b53-9fb7-3d333f8aa503
   - status: closed
   - code: 107
   - lastChanged: {dateTime}
- name: Journey Into Imagination With Figment
   - shortName: Figment
   - id: 75449e85-c410-4cef-a368-9d2ea5d52b58
   - status: closed
   - code: 107
   - lastChanged: {dateTime}
- name: Journey of Water, Inspired by Moana
   - shortName: Moana
   - id: dae68dee-dfba-4128-b594-6aa12add1070
   - status: closed
   - code: 107
   - lastChanged: {dateTime}
- name: Living with the Land
   - shortName: Living with the Land
   - id: 8f353879-d6ac-4211-9352-4029efb47c18
   - status: closed
   - code: 107
   - lastChanged: {dateTime}
- name: Mission: SPACE
   - shortName: Mission Space
   - id: 5b6475ad-4e9a-4793-b841-501aa382c9c0
   - status: closed
   - code: 107
   - lastChanged: {dateTime}
- name: Reflections of China
   - shortName: China 360
   - id: ee070d46-6a64-41c0-9f12-69dcfcca10a0
   - status: closed
   - code: 107
   - lastChanged: {dateTime}
- name: Remy's Ratatouille Adventure
   - shortName: Remys
   - id: 1e735ffb-4868-47f1-b2cd-2ac1156cd5f0
   - status: closed
   - code: 107
   - lastChanged: {dateTime}
- name: Soarin' Around the World
   - shortName: Soarin
   - id: 81b15dfd-cf6a-466f-be59-3dd65d2a2807
   - status: closed
   - code: 107
   - lastChanged: {dateTime}
- name: Spaceship Earth
   - shortName: Spaceship Earth
   - id: 480fde8f-fe58-4bfb-b3ab-052a39d4db7c
   - status: closed
   - code: 107
   - lastChanged: {dateTime}
- name: Test Track
   - shortName: Test Track
   - id: 37ae57c5-feaf-4e47-8f27-4b385be200f0
   - status: closed
   - code: 107
   - lastChanged: {dateTime}
- name: The American Adventure
   - shortName: America
   - id: 1f542745-cda1-4786-a536-5fff373e5964
   - status: closed
   - code: 107
   - lastChanged: {dateTime}
- name: The Seas with Nemo & Friends
   - shortName: Nemo
   - id: fb076275-0570-4d62-b2a9-4d6515130fa3
   - status: closed
   - code: 107
   - lastChanged: {dateTime}
- name: Turtle Talk With Crush
   - shortName: Turtle Talk
   - id: 57acb522-a6fc-4aa4-a80e-21f21f317250
   - status: closed
   - code: 107
   - lastChanged: {dateTime}

---

#### HS

- name: Alien Swirling Saucers
   - shortName: Saucers
   - id: d56506e2-6ad3-443a-8065-fea37987248d
   - status: closed
   - code: 107
   - lastChanged: {dateTime}
- name: Mickey & Minnie's Runaway Railway
   - shortName: MMRR
   - id: 6e118e37-5002-408d-9d88-0b5d9cdb5d14
   - status: closed
   - code: 107
   - lastChanged: {dateTime}
- name: Millennium Falcon: Smugglers Run
   - shortName: Smugglers
   - id: 34c4916b-989b-4ff1-a7e3-a6a846a3484f
   - status: closed
   - code: 107
   - lastChanged: {dateTime}
- name: Slinky Dog Dash
   - shortName: Slinky
   - id: 399aa0a1-98e2-4d2b-b297-2b451e9665e1
   - status: closed
   - code: 107
   - lastChanged: {dateTime}
- name: Star Tours – The Adventures Continue
   - shortName: Star Tours
   - id: 3b290419-8ca2-44bc-a710-a6c83fca76ec
   - status: closed
   - code: 107
   - lastChanged: {dateTime}
- name: Star Wars: Rise of the Resistance
   - shortName: Rise
   - id: 1a2e70d9-50d5-4140-b69e-799e950f7d18
   - status: closed
   - code: 107
   - lastChanged: {dateTime}
- name: The Twilight Zone Tower of Terror™
   - shortName: Tower
   - id: 6f6998e8-a629-412c-b964-2cb06af8e26b
   - status: closed
   - code: 107
   - lastChanged: {dateTime}
- name: Toy Story Mania!
   - shortName: Mania
   - id: 20b5daa8-e1ea-436f-830c-2d7d18d929b5
   - status: closed
   - code: 107
   - lastChanged: {dateTime}
- name: Vacation Fun - An Original Animated Short with Mickey & Minnie
   - shortName: Vacation Fun
   - id: 9211adc9-b296-4667-8e97-b40cf76108e4
   - status: closed
   - code: 107
   - lastChanged: {dateTime}

---

#### AK

- name: Avatar Flight of Passage
   - shortName: Flight
   - id: 24cf863c-b6ba-4826-a056-0b698989cbf7
   - status: closed
   - code: 107
   - lastChanged: {dateTime}
- name: Expedition Everest - Legend of the Forbidden Mountain
   - shortName: Everest
   - id: 64a6915f-a835-4226-ba5c-8389fc4cade3
   - status: closed
   - code: 107
   - lastChanged: {dateTime}
- name: Gorilla Falls Exploration Trail
   - shortName: Gorilla Falls
   - id: e7976e25-4322-4587-8ded-fb1d9dcbb83c
   - status: closed
   - code: 107
   - lastChanged: {dateTime}
- name: Kali River Rapids
   - shortName: Kali
   - id: d58d9262-ec95-4161-80a0-07ca43b2f5f3
   - status: closed
   - code: 107
   - lastChanged: {dateTime}
- name: Kilimanjaro Safaris
   - shortName: Safari
   - id: 32e01181-9a5f-4936-8a77-0dace1de836c
   - status: closed
   - code: 107
   - lastChanged: {dateTime}
- name: Maharajah Jungle Trek
   - shortName: Maharaja
   - id: 1a8ea967-229a-42a0-8290-59b036c84e14
   - status: closed
   - code: 107
   - lastChanged: {dateTime}
- name: Na'vi River Journey
   - shortName: Navi
   - id: 7a5af3b7-9bc1-4962-92d0-3ea9c9ce35f0
   - status: closed
   - code: 107
   - lastChanged: {dateTime}
- name: Wildlife Express Train
   - shortName: Wildlife Express
   - id: 4f391f0e-52be-4f9d-99d6-b3ae0373b43c
   - status: closed
   - code: 107
   - lastChanged: {dateTime}
- name: Zootopia: Better Zoogether!
   - shortName: Zootopia
   - id: 1b15c77b-0311-4171-8e59-7f38e6d60754
   - status: closed
   - code: 107
   - lastChanged: {dateTime}


### Possible Emoji

- 🚫 - park closed for the day
- ❌ - attraction closed
- 🚀 - park operational
- 🟢 - attraction operational
- 🚧 - under construction
- :mk: - Magic Kingdom
- :ep: - Epcot
- :hs: - Disney's Hollywood Studios
- :ak: - Disney's Animal Kingdom
- 🔔 - Notifications On
- 🔕 - Notifications Off
- 📢 - Notifications On
- 🔇 - Notifications Off

---

### Discord Channel Pinned Status

:mk: MK | 07:30 - 25:00 | 🚀
```
🟢 Astro Orbiter        | 🟢 Mansion
🟢 Barnstormer          | 🟢 Mermaid
🚧 Big Thunder          | 🟢 Mine Train
🚧 Buzz                 | 🟢 Pan
🟢 Carousel of Progress | 🟢 PeopleMover
🟢 Carpets              | 🟢 Philhar
🟢 Carrousel            | 🟢 Pirates
🟢 Country Bears        | 🟢 Pooh
🟢 Dumbo                | 🟢 small world
🟢 Enchanted Tales      | 🟢 Space Mtn
🟢 Fantasyland Station  | 🟢 Speedway
🚧 Frontier Station     | 🟢 Teacups
🟢 Hall of Pres         | 🟢 Tiana
🟢 Jungle               | 🟢 Tiki
🟢 Laugh Floor          | 🟢 TRON
🟢 Main Street Station  | 🟢 Treehouse
```
:ep: EP | 09:00 - 21:00 | 🚀
```
🟢 America             | 🟢 Mission Space
🟢 B&B Sing Along      | 🟢 Moana
🟢 Canada 360          | 🟢 Nemo
🟢 China 360           | 🟢 Pixar Shorts
🟢 Figment             | 🟢 Remys
🚧 Frozen              | 🟢 Soarin
🟢 Gran Fiesta         | 🟢 Spaceship Earth
🟢 Guardians           | 🟢 Test Track
🟢 Impressions         | 🟢 Turtle Talk
🟢 Living With The Land
```
:hs: HS | 08:30 - 21:30 | 🚀
```
🟢 Mania               | 🟢 Smugglers
🟢 MMRR                | 🟢 Star Tours
🚧 Rise                | 🟢 Tower
🟢 Saucers             | 🟢 Vacation Fun
🟢 Slinky
```
:ak: AK | 07:30 - 19:00 | 🚫
```
🚫 Everest             | 🚫 Navi
🚫 Flight              | 🚫 Safari
🚫 Gorilla Falls       | 🚫 Wildlife Express
🚫 Kali                | 🚫 Zootopia
🚫 Maharaja
```

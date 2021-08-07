require('dotenv').config();

const { Client, Intents } = require('discord.js');
const ytdl = require('ytdl-core');
const {
  AudioPlayerStatus,
  StreamType,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
} = require('@discordjs/voice');

const julioPhrases = [
  'En 1970 di 41 conciertos en 41 ciudades españolas distintas en 30 días. Hice el amor todas las noches. 41 ciudades diferentes, 41 novias diferentes. Fue mi etapa rockera',

  'He cambiado mucho de cuando era joven. Por ejemplo: ahora me aterra volar. No me gusta y me da ansiedad cuando hay turbulencias en el avión. Antes me daba igual: mi único interés cuando subía a un avión era ligarme a la azafata para follármela en el baño. Ah, la Viagra, qué gran invento',

  'Tengo 40 años y ya soy demasiado mayor para ser el nuevo sex symbol norteamericano',

  'Soy un amante seguro. Amo ser amado',

  'Cuando me miro en el espejo no entiendo nada de lo que pasa conmigo',

  'Cuando llegué aquí (refiriéndose a Miami) , no podía hablar una palabra de inglés, pero mi vida sexual era perfecta. Ahora mi inglés es perfecto, pero mi vida sexual es una basura',

  'Fíjense que yo tenía una cábala, o capricho, o como sea, que era el siguiente: no podía subirme a un escenario a cantar si antes no hacía el amor. Entonces era como un conejito, ‘chaca, chaca, chaca’... y me iba a cantar. Pero era espantoso, porque después, mientras estaba en el escenario, quería terminar rápido sabiendo que tenía una mujer desnuda esperándome en la habitación',

  'Tengo 63 años, doy asco. Pero por supuesto aún tengo la capacidad de seducir físicamente. La única cosa que ha mejorado es que he aprendido a cantar',

  'Yo no he sido un buen amante, pero ¿qué es un buen amante? Joaquín (Sabina) y Joan Manuel (Serrat) deben haber sido mejores amantes que yo. Las gentes con prisas no somos buenos amantes',

  'A veces siento la vergüenza de decir, ¡coño!, la gente debe estar pensando que he tenido tantas y tantas mujeres. Seguramente he tenido más de las que me he merecido y millones menos de las que ustedes creen',

  'La primera vez que visité Londres mi mánager me dijo: “Los periódicos dicen que te has acostado con 3.000 mujeres”. Yo le dije que no comentara a nadie que no era verdad. Ahora estamos en 2014, así que la cifra debe de haber subido a 20.000. Yo no llevo la cuenta ',

  'Mi primer beso se lo di a la chica que yo creía que era mi novia, seguramente ella no lo sabía. No hubo beso. El primer beso no me acuerdo muy bien, pero seguramente fue robado',

  'Nunca se interesó (refiriéndose a Isabel Preysler) por mi carrera artística de una forma activa, pero sí pasiva. Ella me llenaba de emociones, me ayudó muchísimo, pero en lo que se refiere al artista trató siempre de separar los caminos y esa ha sido una de las causas fundamentales del fracaso de nuestro matrimonio',

  'Mi meta es hacer a la gente soñar. Cuando me ven en el escenario lo que imaginan sobre mí y la realidad se unen. Les seduzco. Pero primero tengo que seducirme a mí mismo',

  'No sé hacer otra cosa que cantar. ¿Qué quieres? ¿Que me quede en casa tocándome el pito? No podría',

  'El inglés es un idioma que me ha costado tantísimo trabajo aprender. Hasta hace apenas quince días tenía una profesora quince horas diarias, una chica de 27 años guapísima, que no hablaba el español y que ahora lo habla a la perfección mientras yo todavía no hablo bien el inglés” (lo dijo cuando sacó su primer disco en inglés) .',

  'Me parece perfecto que le den el Nobel de Literatura porque Dylan representa la revolución del ‘hey, baby’. Es un grandísimo escritor. Ha hecho mucho por la lingüística inglesa. Nunca olvidaré el día que entré con él en un ascensor en Sao Paulo, desde el que se veían todos los pisos, y me dijo: ‘Oye, Julio, a ver cuándo empiezas a grabar mis canciones, chico',

  'Para amar el vino tinto tienes que tener un enfoque sano de la vida. El vino tinto es la vida, la única vida que puedes meter en una botella',

  'No he estado con muchas mujeres, sino que he estado con muchos amores, que es diferente',
  "Para mí, no hacer nada es tener dos horas para flotar en el agua, que es un paraíso, y pienso: 'Dios, qué hombre tan afortunado soy",
  '¿Qué pasó con Gwendolyne? Era la hija de la familia más rica de Francia. Yo no sabía que era rica, sino que estaba rica. Ella tenía 18 años y yo 25. Se casó con un banquero. La última vez que la vi fue en un concierto en Lyon, hace como 20 años. Seguía guapísima',
  'La Televisión Española informa muy mal. Es increíble que cuando las más importantes televisiones del mundo siguen los conciertos de Plácido Domingo, de Monserrat Caballé o conectan en directo para que la gente viva el momento en que Ángel Nieto gana una carrera o presencie el triunfo de Severiano Ballesteros, aquí se ignoren esos acontecimientos. Pero prefieren hacer cosas aburridísimas y hablar del aborto en lugar de tener una programación de verdad divertida e interesante',
  'Quiero cantar cosas simples para las simples vidas de gente simple',
  'He pasado por gilipollas para algunas generaciones, pero a lo mejor ahora ya no lo soy tan gilipollas porque, cuando me dan un vino, sé si es blanco o tinto, incluso a veces sé si es uno del 82 o del 61. Si me hablan de Sófocles, también puedo hablar de mi Pitón',
  'La infidelidad es un concepto muy raro. Me imagino a una persona en una mesa escribiendo y que ve pasar a alguien guapo y piensa: “A este me lo follaría”. Pues eso es infidelidad. Si piensas que te vas a follar a alguien, estás cometiendo un pecado, y esos los cometo todos los días',
  'Vendes discos porque eres mi hijo, si no no los venderías',
  'Amante bueno es el que tiene tiempo, que no tiene problemas, el que se dedica a ella 🙄',
  'Yo tengo que decir que dispongo de la inmensa suerte de cantar para los pueblos, y no para los gobernantes',
  'Una vez que has probado el aplauso de 50.000 personas, te sentirás mal el día que solo te aplaudan 2.000. El mayor problema de mi trabajo es que puedes perderlo. Un día eres un triunfador pero, al siguiente, no importa la gran estrella que seas, puedes ser un perdedor ',
  'Cuando el cuadro cuelga de tu pared durante mucho tiempo, no te das cuenta. Te cansas de él, incluso si es un Picasso. Cuando la siguiente generación herede el cuadro, lo vende. Yo no quiero ser vendido',
  'En casa le canto a un perro. Se llama Berkeley, como la universidad. Si me pongo a cantar con mi mujer o mis hijos, se ponen a hablar, pero el perro me escucha y no ladra',
  'Cuando llegas a los 35 años de tu carrera, haces álbumes para que tus fans te amen más, para que no te olviden',
  'Las oportunidades que tenemos los hombres públicos son muchas. Efectivamente, yo junto los ojos con la gente mucho más rápido de lo que esperaba. Cuando era un chaval joven nadie me miraba y cuando empecé a dar tres notas en la guitarra me empezaron a mirar (…) Es cierto que me he divertido mucho pero nunca he hecho nada',
  'He sido como Ronaldo en el Bernabéu. Las críticas me han hecho meter más goles 😉',
];

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
});

client.once('ready', () => {
  console.log('Julio activo!');
});

let julioAwake = true;
client.on('messageCreate', async (message) => {
  const randomNumber = Math.floor(Math.random() * julioPhrases.length);
  const randomMessage = julioPhrases[randomNumber];
  const Guild = client.guilds.cache.get(message.guildId);
  const Member = Guild.members.cache.get(message.author.id);

  //Fetch client application
  if (!client.application?.owner) await client.application?.fetch();
  if (julioAwake) {
    for (let word of message.content.toLowerCase().split(' ')) {
      if (word === 'julio') {
        message.channel.send(randomMessage);
      } else if (word === 'guapa') {
        message.channel.send(
          'Ahora que dices guapa, me acuerdo de tu madre, fíjense que yo tenía una cábala, o capricho, o como sea, que era el siguiente: no podía subirme a un escenario a cantar si antes no hacía el amor con ella. Entonces era como un conejito, ‘chaca, chaca, chaca’... y me iba a cantar. Pero era espantoso, porque después, mientras estaba en el escenario, quería terminar rápido sabiendo que tenía a tu madre desnuda esperándome en la habitación'
        );
      } else if (message.content.toLowerCase() === '!julio') {
        message.channel.send(
          'https://tenor.com/view/espa%C3%B1a-barco-mar-julio-iglesias-1de-julio-gif-12098958'
        );
      } else if (message.content.toLowerCase() === '!losabes') {
        message.channel.send(
          'https://tenor.com/view/ylosabes-smile-you-hehe-ohyou-gif-6983056'
        );
      } else if (message.content.toLowerCase() === '!welcome') {
        message.channel.send(
          'https://tenor.com/view/julio-1de-julio-julio-iglesias-bienvenido-gif-12098957'
        );
      } else if (message.content.toLowerCase() === '!baile') {
        message.channel.send(
          'https://tenor.com/view/julio-iglesias-baile-movimiento-gif-11418177'
        );
      } else if (message.content.toLowerCase() === '!duerme') {
        julioAwake = false;
        message.channel.send(
          'Me voy a beber unas copas, avisame con !despierta'
        );
      } else if (
        !message.author.bot &&
        message.content.toLowerCase() === '!maestro'
      ) {
        //Get voice channel

        const voiceChannel = Member.voice.channel;
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
          return message.channel.send(
            'I need the permissions to join and speak in your voice channel!'
          );
        }

        const songsArray = [
          'https://www.youtube.com/watch?v=Eja6fidZ3Y8',
          'https://www.youtube.com/watch?v=p2AnF7mhmJg',
          'https://www.youtube.com/watch?v=u2RjYQQp4NQ',
        ];

        const stream = ytdl(
          songsArray[Math.floor(Math.random() * songsArray.length)],
          {
            filter: 'audioonly',
          }
        );
        const connection = joinVoiceChannel({
          channelId: Member.voice.channel.id,
          guildId: Guild.id,
          adapterCreator: Guild.voiceAdapterCreator,
        });

        const resource = createAudioResource(stream, {
          inputType: StreamType.Arbitrary,
        });
        const player = createAudioPlayer();

        player.play(resource);

        connection.subscribe(player);
        player.on(AudioPlayerStatus.Buffering, () => {
          console.log('The audio player is buffering!');
        });
        player.on(AudioPlayerStatus.Playing, () => {
          console.log('The audio player has started playing!');
        });

        player.on(AudioPlayerStatus.Idle, () => connection.destroy());
      } else if (message.content.toLowerCase() === '!calla') {
        const connection = joinVoiceChannel({
          channelId: Member.voice.channel.id,
          guildId: Guild.id,
          adapterCreator: Guild.voiceAdapterCreator,
        });
        connection.destroy();
      }
    }
  } else {
    if (message.content === '!despierta') {
      julioAwake = true;
      message.channel.send('Soy un viejo, pero hoy me he levantado chaval');
    }
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);

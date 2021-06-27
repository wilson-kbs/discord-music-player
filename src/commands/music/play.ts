import { Youtube } from '@/services/download/youtube';
import { Message, MessageEmbed, TextChannel, VoiceChannel } from 'discord.js';
import { SQLiteProvider } from 'discord.js-commando';
import {
  ArgumentCollectorResult,
  Command,
  CommandoClient,
  CommandoMessage,
} from 'discord.js-commando';

type Args = {
  subCommand: string;
  target: string;
};

export class Play extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'play',
      aliases: ['listen', 'stream'],
      group: 'music',
      memberName: 'play',
      description: 'Plays loaded queue',
      examples: ['play', 'play <YOUTUBE-URL>'],
      guildOnly: true,
      // clientPermissions: ['CONNECT', 'SPEAK'],
      args: [
        {
          key: 'subCommand',
          prompt: 'Sub-command',
          type: 'string',
          default: '',
        },
        {
          key: 'target',
          prompt: 'Target',
          type: 'string',
          default: '',
        },
      ],
    });

    try {
      this._initListeners();
    } catch (e) {
      console.log('Failed to initialize PlayCommand listeners', e);
    }
  }

  async run(
    message: CommandoMessage,
    args: Args,
    _fromPattern: boolean,
    _result?: ArgumentCollectorResult<object>,
  ): Promise<Message | Message[]> {
    const youtube = this.client.youtube;
    const music = this.client.music;

    try {
      if (args.subCommand == 'yt') {
        if (!args.target)
          return message.reply(
            'Error: Please use this synthax `!play yt <YOUTUBE-URL>`',
          );
        if (!youtube.validateURL(args.target))
          return message.reply(
            'Error: Please use this synthax `!play yt <YOUTUBE-URL>`',
          );
        console.log(args.target);

        if (message.channel instanceof TextChannel) {
          await music.joinChannel(
            message.guild,
            message.channel,
            message.member?.voice.channel,
          );

          const tracks = await youtube.getInfo(args.target);
          music.addTracksInQueue(message.guild, tracks);
          music.play(message.guild, message.channel);
        }
      } else if (args.subCommand == 'tw') {
        if (message.channel instanceof TextChannel) {
          await music.joinChannel(
            message.guild,
            message.channel,
            message.member?.voice.channel,
          );
          music.playOther(message.guild, message.channel, args.target);
        }
      } else if (args.subCommand == '') {
        if (message.channel instanceof TextChannel)
          return music.resume(message.guild, message.channel);
      }
    } catch (e) {
      throw e;
    }

    // try {
    //   if (message.channel instanceof TextChannel)
    //     music.play(message.guild, message.channel);
    // } catch (e) {
    //   console.log(e);
    //   return message.say(
    //     'Something went horribly wrong! Please try again later.',
    //   );
    // }
  }

  private _initListeners() {
    this.client.music.on('play', (text, _guild, channel) => {
      channel.send(text);
    });
  }
}

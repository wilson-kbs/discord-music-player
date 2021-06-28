import { Injectable } from '@nestjs/common';
import { CommandoClient, CommandoRegistry } from 'discord.js-commando';

import { ClientProvider } from '@/providers/client';

import { Play } from './music/play';
import { Stream } from './music/stream';
import { Pause } from './music/pause';
import { Next } from './music/next';
import { Stop } from './music/stop';
import { Kill } from './music/kill';
import { Volume } from './music/volume';
import { Youtube } from './music/youtube';
import { Config } from './system/config';

export const MusicCommands = [Play, Pause, Next, Stop, Kill];

@Injectable()
export class CommandsService {
  constructor(private clientProvider: ClientProvider) {}

  register(client: CommandoClient) {
    client.registry
      .registerDefaultTypes()
      .registerDefaultGroups()
      .registerDefaultCommands({
        help: false,
        prefix: false,
        ping: false,
        eval: false,
        unknownCommand: false,
        commandState: false,
      })
      .registerGroups([
        ['music', 'Musique'],
        ['sys', 'System'],
      ])
      .registerCommands([Play, Stream, Pause, Stop, Volume, Youtube, Config]);
  }
}

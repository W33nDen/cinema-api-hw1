import { Module } from '@nestjs/common';
import { ShowingsStore } from './showings.store';

/** Showings storage without controllers or dependencies; see ShowingsStore. */
@Module({
  providers: [ShowingsStore],
  exports: [ShowingsStore],
})
export class ShowingsCoreModule {}

import Library from '#models/library'
import { HttpContext } from '@adonisjs/core/http'

export class LibraryService {
  constructor(private auth: HttpContext['auth']) {}

  async getTargetLibrary(libraryId?: number): Promise<Library> {
    if (libraryId) {
      return await Library.query()
        .where('id', libraryId)
        .where('user_id', this.auth.user!.id)
        .firstOrFail()
    }

    return await Library.query()
      .where('user_id', this.auth.user!.id)
      .orderBy('created_at', 'asc')
      .firstOrFail()
  }
}

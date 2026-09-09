import chinTuck from './chin-tuck.svg'
import openBook from './open-book.svg'
import neckIsometric from './neck-isometric.svg'
import thoracicExtension from './thoracic-extension.svg'
import gentleNeckRom from './gentle-neck-rom.svg'
import wallSlidePlus from './wall-slide-plus.svg'
import serratusPunch from './serratus-punch.svg'
import wallPushupPlus from './wall-pushup-plus.svg'
import elevatedPushupPlus from './elevated-pushup-plus.svg'
import scapularPushup from './scapular-pushup.svg'
import reformerRow from './reformer-row.svg'
import bandEr from './band-er.svg'
import deadBug from './dead-bug.svg'
import plank from './plank.svg'
import stretch from './stretch.svg'
import type { ExerciseId } from '../../data/types'

export const EXERCISE_SVGS: Record<ExerciseId, string> = {
  'chin-tuck': chinTuck,
  'open-book': openBook,
  'neck-isometric': neckIsometric,
  'thoracic-extension': thoracicExtension,
  'gentle-neck-rom': gentleNeckRom,
  'wall-slide-plus': wallSlidePlus,
  'serratus-punch': serratusPunch,
  'wall-pushup-plus': wallPushupPlus,
  'elevated-pushup-plus': elevatedPushupPlus,
  'scapular-pushup': scapularPushup,
  'reformer-row': reformerRow,
  'band-er': bandEr,
  'dead-bug': deadBug,
  plank,
  stretch,
}

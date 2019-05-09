import { from } from 'rxjs'
import { map } from 'rxjs/operators'

describe('basic', () => {
  beforeAll(async () => {})

  it('from, map', (done) => {
    const result: number[] = []

    // 1. observable 생성
    const sample$ = from([1, 2, 3])

    sample$
      // pipe: https://rxjs-dev.firebaseapp.com/api/index/function/pipe
      .pipe(
        // marble (map): https://rxmarbles.com/#map
        map((v) => {
          return v * 2
        }),
      )
      .subscribe({
        next: (v) => {
          result.push(v)
        },
        complete: () => {
          expect(result).toEqual([2, 4, 6])
          done()
        },
      })
  })

  afterAll(async () => {})
})

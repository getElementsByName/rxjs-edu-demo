import { Observable } from 'rxjs'

describe('Observable', () => {
  beforeAll(async () => {})

  it('create', (done) => {
    const result: number[] = []

    const numbers$ = new Observable<number>(function subscribe(observer) {
      observer.next(1)
      observer.next(2)
      observer.next(3)
      observer.complete()
    })

    numbers$.subscribe((v) => result.push(v), null, () => {
      expect(result).toEqual([1, 2, 3])
      done()
    })
  })

  afterAll(async () => {})
})

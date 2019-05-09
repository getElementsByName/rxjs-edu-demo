import { Observable } from 'rxjs'

describe('Observable', () => {
  beforeAll(async () => {})

  it('create', (done) => {
    const result: number[] = []
    let isClear = false


    // http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#static-method-create
    const numbers$ = new Observable<number>(function subscribe(observer) {
      observer.next(1)
      observer.next(2)
      observer.next(3)
      observer.complete()

      // TeardownLogic
      // http://reactivex.io/rxjs/class/es6/MiscJSDoc.js~TeardownLogicDoc.html
      return () => {
        isClear = true

        expect(isClear).toEqual(true)
        // subscribe complete 이후 수행 됌.
        done()
      }
    })

    numbers$.subscribe((v) => result.push(v), null, () => {
      expect(result).toEqual([1, 2, 3])
    })
  })

  it('error handle', (done) => {
    const customError = new Error('custom error')
    const result: number[] = []

    const numbers$ = new Observable<number>(function subscribe(observer) {
      observer.next(1)
      observer.next(2)
      throw customError
      observer.next(3)
    })

    numbers$.subscribe(
      (v) => result.push(v),
      (err) => {
        expect(err).toEqual(customError)
        expect(result).toEqual([1, 2])  // 1, 2는 수행 되고 에러 이후 3은 수행 안 됌
        done()
      },
    )
  })

  afterAll(async () => {})
})

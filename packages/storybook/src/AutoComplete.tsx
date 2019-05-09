import * as React from 'react'
import './AutoComplete.css'
import { fromEvent, partition } from 'rxjs'
import { map, debounceTime, distinctUntilChanged, tap, switchMap, finalize, retry, share } from 'rxjs/operators'
import { ajax } from 'rxjs/ajax'

interface GithubUser {
  avatar_url: string
  html_url: string
  login: string
}

const GITHUB_USER_TOKEN = '91fa826e1bffd0ef9fbb49afe2d5abcc4895decb'

const AutoComplete: React.FC<{}> = () => {
  React.useEffect(() => {
    const $layer = document.getElementById('suggestLayer')

    function drawLayer(items: GithubUser[]) {
      if($layer) {
        $layer.innerHTML = items
        .map(user => {
          return `<li class="user">
          <img src="${user.avatar_url}" width="50px" height="50px"/>
          <p><a href="${user.html_url}" target="_blank">${user.login}</a></p>
        </li>`;
        })
        .join("");
      }
    }

    const $loading = document.getElementById('loading')
    function showLoading() {
      if($loading) {
        $loading.style.display = 'block'
      }
    }
    function hideLoading() {
      if($loading) {
        $loading.style.display = 'none'
      }
    }

    const inputElement = document.getElementById('search')

    if (inputElement) {
      const keyup$ = fromEvent(inputElement, 'keyup').pipe(
        debounceTime(300),
        map((event: any /* TODO: typing */) => {
          if (event && event.target) {
            return event.target.value as string
          }

          return null
        }),
        distinctUntilChanged(),
        tap(console.log),
        share() // === publish refCount (multi subcribe 구조에서 중복 처리 막고 multicast)
      )

      const [showUser$, reset$] = partition(keyup$, (inputString) => {
        if (inputString) {
          return inputString.trim().length > 0
        }
        return false
      })

      const showUserResult$ = showUser$.pipe(
        tap(showLoading),
        switchMap((value: string) => {  // 새로운 observable이 오면 이전 observable은 무시
          return ajax({
            url: `https://api.github.com/search/users?q=${value}`,
            method: 'GET',
            headers: {
              Authorization: GITHUB_USER_TOKEN,
            },
          })
        }),
        retry(2),
        map((result) => result.response.items as GithubUser[]),
        finalize(hideLoading),
      )

      showUserResult$.subscribe(drawLayer)

      reset$.subscribe(() => {
        drawLayer([])
      })
    }
  }, [])

  return (
    <div>
      <p>사용자 검색</p>
      <div className="autocomplete">
        <input id="search" type="input" placeholder="검색하고 싶은 사용자 아이디를 입력해주세요" />
        <ul id="suggestLayer" />
        <div id="loading">
          <i className="fas fa-spinner fa-pulse">LOADING...</i>
        </div>
      </div>
    </div>
  )
}

export { AutoComplete }

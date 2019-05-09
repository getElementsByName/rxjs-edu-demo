import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { AutoComplete } from '../src/AutoComplete'

storiesOf('AutoComplete', module)
    .add('basic', () => (
        <>
            <AutoComplete />
        </>
    ))

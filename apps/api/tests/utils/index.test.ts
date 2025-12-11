import {
    describe,
    it,
    expect,
    beforeEach,
    afterEach,
    mock,
    jest
} from 'bun:test'

import { Utils } from '../../src/utils'

describe('gracefulShutdown', () => {
    let consoleLogSpy: ReturnType<typeof mock>
    let processExitSpy: ReturnType<typeof mock>
    let originalExit: typeof process.exit
    let originalLog: typeof console.log

    beforeEach(() => {
        jest.useFakeTimers()

        originalLog = console.log
        consoleLogSpy = mock(() => {})
        console.log = consoleLogSpy

        // eslint-disable-next-line @typescript-eslint/unbound-method
        originalExit = process.exit
        processExitSpy = mock(() => {})
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        process.exit = processExitSpy as any
    })

    afterEach(() => {
        jest.useRealTimers()
        console.log = originalLog
        process.exit = originalExit
    })

    it('should log goodbye message after 5 seconds', () => {
        Utils.gracefulShutdown()

        jest.advanceTimersByTime(5000)

        expect(consoleLogSpy).toHaveBeenCalledWith('Good Bye')
    })

    it('should call process.exit after 5 seconds', () => {
        Utils.gracefulShutdown()

        jest.advanceTimersByTime(5000)

        expect(processExitSpy).toHaveBeenCalled()
    })

    it('should not call process.exit immediately', () => {
        Utils.gracefulShutdown()

        expect(processExitSpy).not.toHaveBeenCalled()
        expect(consoleLogSpy).not.toHaveBeenCalled()
    })

    it('should not call process.exit before 5 seconds', () => {
        Utils.gracefulShutdown()

        jest.advanceTimersByTime(4999)

        expect(processExitSpy).not.toHaveBeenCalled()
        expect(consoleLogSpy).not.toHaveBeenCalled()
    })
})

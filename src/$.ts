import { spawn } from "node:child_process";
import { once } from "node:events";

function $(strings: TemplateStringsArray, ...inserts: Insert[]): ExecaChildProcess {
    let options = this ?? {};
    if (!Array.isArray(strings)) {
        Object.assign(options, strings)
        return $.bind(options)
    }
    const { reject = true, } = options
    const keyFor = (i) => `__inserts[${i}]`;
    const replaceKey = s => s.replace(/__values\[(\d+)\]/g, (m, i) => inserts[i]);
    const cmdWithKeys = strings
      .flatMap((s, i) => (i ? [keyFor(i - 1), s] : s))
      .join("");
    let argv = cmdWithKeys.split(/\s+/);
    argv = argv.map((arg) => replaceKey(arg));
    const argv0 = argv.shift()!;
    const cp = spawn(argv0, argv, options) as ExecaChildProcess
    const p = (async () => {
        const [exitCode, signal] = await once(cp, "exit")
        const res = {
            exitCode,
            signal,
            stdout: await stdoutP,
            stderr: await stderrP,
        }
        if (reject) {
        if (signal) {
            throw res;
        }
        if (exitCode) {
            throw res
        }
    }
        return res;
    })()
    cp.then = p.then.bind(p)
    return cp;
}

export default $;
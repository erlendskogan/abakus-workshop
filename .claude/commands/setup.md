---
description: Start the PostgreSQL database in Docker and connect the postgres MCP server
disable-model-invocation: true
---

Get the team's machine ready for the workshop: PostgreSQL runs in Docker, and the `postgres` MCP server is connected to it. The section `## Teknisk oppsett` in `README.md` has the commands. This command finds out which steps the machine still needs, and runs them.

The team can be new to programming. Talk to them in short, plain Norwegian (bokmål):

- Before step 1, call the Skill tool with `simple-english`. Apply its sentence and structure rules to the Norwegian text, and choose plain Norwegian words in place of its English word lists.
- Keep each message to a few short sentences: what you did, and what happens next.
- Docker, container, database and MCP are new words for many students. Explain each one in one short sentence the first time you use it.
- When the team must do something, give one action at a time, with the exact text to type or the button to click.
- When something fails, say in one plain sentence what went wrong and what to do next.

1. Make sure Docker runs. Run `docker info`. If it shows a server version, go to step 2.

   Otherwise, find out which Docker engine the team uses. `docker context show` names the active engine: `colima` is Colima, `desktop-linux` is Docker Desktop, `orbstack` is OrbStack, and `rancher-desktop` is Rancher Desktop. `default` is often Docker Engine on Linux. Then check which engines are installed: the commands `colima`, `orb` and `rdctl`, and the apps Docker Desktop, OrbStack and Rancher Desktop. If more than one engine is installed, or the active context does not match the installed engine, ask the team which engine they use. To switch the active context, ask the team first, then run `docker context use <context>`.

   Start the engine:
   - Colima: `colima start`
   - Docker Desktop: `docker desktop start`, or open the Docker Desktop app (on macOS: `open -a Docker`)
   - OrbStack: `orb start`
   - Rancher Desktop: `rdctl start`
   - Docker Engine on Linux: ask the team to run `! sudo systemctl start docker`

   If `docker` is not found, or no engine is installed, help the team install one. Docker Desktop works on all operating systems: https://docs.docker.com/get-started/get-docker/. On macOS with Homebrew, Colima is a lighter option: `brew install colima docker`. Ask the team before you install anything. Then start the engine.

   An engine can take a minute to start. Run:

   ```sh
   for i in $(seq 30); do docker info --format '{{.ServerVersion}}' 2>/dev/null && break; sleep 2; done
   ```

   The step is done when the output shows a server version. If it does not, show the error from `docker info` to the team, and help them from it.

2. Start the container `abakus-postgres`. Run `docker container inspect --format '{{.State.Status}}' abakus-postgres`.
   - `No such container`: the container does not exist. Run the build command and the start command from `### Database (PostgreSQL)` in `README.md`.
   - `running`: go to step 3.
   - Any other state: run `docker start abakus-postgres`.

   If the port in the start command is already in use, find the program that listens on it (for example with `lsof -nP -iTCP:<port> -sTCP:LISTEN`). Tell the team which program it is, and ask them to stop it. Then start the container again.

   The container and the volume `abakus-postgres-data` hold the team's data. Keep them. Remove them only if the team asks for it.

3. Wait for the database. Run:

   ```sh
   for i in $(seq 30); do docker exec abakus-postgres pg_isready -U abakus -d abakus_workshop && break; sleep 1; done
   ```

   The step is done when the output says `accepting connections`. If it does not, read `docker logs abakus-postgres`, explain the error to the team, and stop.

4. If `.env.local` does not exist, copy `.env.template` to `.env.local`. It holds the connection URL (`DATABASE_URL`) for the team's app.

5. Download the MCP server. Read the `postgres` entry in `.mcp.json`. Run its `command` with its `args` and `--help` at the end. The first run downloads the server, so the connection in step 6 does not time out.

   The step is done when the output shows the usage text (`usage: postgres-mcp`). If the output shows an error, the MCP server cannot start. Show the error to the team, tell them to ask the workshop host for help, and stop.

6. Connect the MCP server. Claude Code starts MCP servers when the session starts. If the database was down then, the `postgres` server is not connected. Ask the team to run `/mcp`, select `postgres`, and enable or reconnect it. Wait until they say it is done. If the reconnect times out after 30 seconds, the MCP server could not reach the database: go back to step 3. On Linux, a timeout while the database is ready means that the container cannot reach `host.docker.internal`: follow `#### På Linux` in `README.md`.

7. Check the connection. Call the `postgres` MCP tool that lists schemas. The step is done when the result includes the schema `public`. If the tool is not available, ask the team what `/mcp` shows for `postgres`, and help them from that output.

8. Tell the team that the setup is done: the database runs, `.env.local` has the connection URL, and the `postgres` MCP server is connected. Tell them that the next step is `/generate-product`. Then stop.

The only file this command creates is `.env.local`.

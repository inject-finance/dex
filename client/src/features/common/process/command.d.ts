export type Command<State> = (state: State) => Promise<State>

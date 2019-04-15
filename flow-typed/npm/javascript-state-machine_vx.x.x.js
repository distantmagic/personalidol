// flow-typed signature: 0968b55b37702c0a270828210a61539a
// flow-typed version: <<STUB>>/javascript-state-machine_v3.1.0/flow_v0.89.0

/**
 * This is an autogenerated libdef stub for:
 *
 *   'javascript-state-machine'
 *
 * Fill this stub out by replacing all the `any` types.
 *
 * Once filled out, we encourage you to share your work with the
 * community by sending a pull request to:
 * https://github.com/flowtype/flow-typed
 */

declare module "javascript-state-machine" {
  declare type InternalStates<States> = States & string;

  declare export type TransitionsConfiguration<States, Transitions> = Array<{|
    name: $Keys<Transitions>,
    from: InternalStates<States>,
    to: InternalStates<States>
  |}>;

  declare export type TransitionEvent<States, Transitions> = {|
    from: InternalStates<States>,
    to: InternalStates<States>,
    transition: $Keys<Transitions> | "init"
  |};

  declare type GenericTransitionCallback<States, Transitions> = (
    transition: $Keys<Transitions>,
    from: InternalStates<States>,
    to: InternalStates<States>
  ) => void;

  declare type HelperMethods<States, Transitions> = {|
    allStates(): Array<States>,

    allTransitions(): Array<$Keys<Transitions>>,

    can($Keys<Transitions>): boolean,

    cannot($Keys<Transitions>): boolean,

    is(States): boolean,

    transitions(): Array<$Keys<Transitions>>
  |};

  declare export type StateMachineInstance<States, Transitions, Data> = {|
    ...$Exact<Data>,
    ...$Exact<Transitions>,
    ...$Exact<HelperMethods<States, Transitions>>,

    +state: InternalStates<States>
  |};

  declare type StateMachineConfigurationBase<States, Transitions, Methods> = {|
    init?: InternalStates<States>,
    transitions: TransitionsConfiguration<States, Transitions>,
    methods: {|
      ...$Exact<Methods>,

      onAfterTransition?: (evt: TransitionEvent<States, Transitions>) => void,
      onInvalidTransition?: GenericTransitionCallback<States, Transitions>,
      onPendingTransition?: GenericTransitionCallback<States, Transitions>,
      onTransition?: (evt: TransitionEvent<States, Transitions>) => void
    |}
  |};

  declare type StateMachineConfigurationClass<
    States,
    Transitions,
    Methods,
    Data
  > = {|
    ...$Exact<StateMachineConfigurationBase<States, Transitions, Methods>>,

    data: Data
  |};

  declare type StateMachineConfigurationFactory<
    States,
    Transitions,
    Methods,
    Data,
    ConstructorArguments
  > = {|
    ...$Exact<StateMachineConfigurationBase<States, Transitions, Methods>>,

    data: (...args: ConstructorArguments) => Data
  |};

  declare export class StateMachineFactoryClass<
    States,
    Transitions,
    Data,
    ConstructorArguments
  > {
    constructor(
      ...args: ConstructorArguments
    ): StateMachineInstance<States, Transitions, Data>;
  }

  declare export default class StateMachine<
    States,
    Transitions,
    Methods,
    Data
  > {
    static factory<
      TStates,
      TTransitions,
      TMethods,
      TData,
      TConstructorArguments
    >(
      StateMachineConfigurationFactory<
        TStates,
        TTransitions,
        TMethods,
        TData,
        TConstructorArguments
      >
    ): Class<
      StateMachineFactoryClass<
        TStates,
        TTransitions,
        TData,
        TConstructorArguments
      >
    >;

    constructor(
      StateMachineConfigurationClass<States, Transitions, Methods, Data>
    ): StateMachineInstance<States, Transitions, Data>;
  }
}

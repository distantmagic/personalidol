// @flow

import * as angle from "../helpers/angle";
import ElementPosition from "./ElementPosition";
import ElementRotation from "./ElementRotation";
import TiledPathException from "./Exception/Tiled/Path";

import type { ElementPosition as ElementPositionInterface } from "../interfaces/ElementPosition";
import type { ElementPositionUnit } from "../types/ElementPositionUnit";
import type { ElementRotation as ElementRotationInterface } from "../interfaces/ElementRotation";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { TiledPath as TiledPathInterface } from "../interfaces/TiledPath";

export default class TiledPath<T: ElementPositionUnit> implements TiledPathInterface<T> {
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +steps: Array<ElementPositionInterface<T>>;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs) {
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.steps = [];
  }

  addStep(elementPosition: ElementPositionInterface<T>): void {
    this.steps.push(elementPosition);
  }

  getClosestStep(other: ElementPositionInterface<T>): ElementPositionInterface<T> {
    return this.getSteps()[this.getClosestStepIndex(other)];
  }

  getClosestStepIndex(other: ElementPositionInterface<T>): number {
    const steps = this.getSteps();

    if (steps.length < 1) {
      throw new TiledPathException(this.loggerBreadcrumbs, "Path has no steps.");
    }

    let closest: ElementPositionInterface<T> = steps[0];
    let closestStepIndex: number = 0;

    for (let i = 0; i < steps.length; i += 1) {
      if (steps[i].isEqual(other)) {
        return i;
      }
      if (steps[i].distanceTo(other) < closest.distanceTo(other)) {
        closest = steps[i];
        closestStepIndex = i;
      }
    }

    return closestStepIndex;
  }

  getClosestNextStep(other: ElementPositionInterface<T>): ElementPositionInterface<T> {
    if (this.getLength() < 2) {
      throw new TiledPathException(this.loggerBreadcrumbs, "There is no next step");
    }

    if (!this.hasStep(other)) {
      throw new TiledPathException(this.loggerBreadcrumbs, "Point does not belong to path.");
    }

    const steps = this.getSteps();
    const closestStepIndex = this.getClosestStepIndex(other);
    const closestPotentialNextStep = steps[closestStepIndex + 1];

    if (!closestPotentialNextStep) {
      // this is the last step
      return steps[closestStepIndex];
    }

    const closestStep = steps[closestStepIndex];
    if (this.getDistanceAtElementPosition(other) < this.getDistanceAtElementPosition(closestStep)) {
      return closestStep;
    }

    return closestPotentialNextStep;
  }

  getClosestPreviousStep(other: ElementPositionInterface<T>): ElementPositionInterface<T> {
    if (this.getLength() < 2) {
      throw new TiledPathException(this.loggerBreadcrumbs, "There is no next step");
    }

    if (!this.hasStep(other)) {
      throw new TiledPathException(this.loggerBreadcrumbs, "Point does not belong to path.");
    }

    const steps = this.getSteps();
    const closestStepIndex = this.getClosestStepIndex(other);
    const closestPotentialPreviousStep = steps[closestStepIndex - 1];

    if (!closestPotentialPreviousStep) {
      // this is the last step
      return steps[closestStepIndex];
    }

    const closestStep = steps[closestStepIndex];
    if (this.getDistanceAtElementPosition(other) > this.getDistanceAtElementPosition(closestStep)) {
      return closestStep;
    }

    return closestPotentialPreviousStep;
  }

  getDistanceAtElementPosition(other: ElementPositionInterface<T>): number {
    if (this.getLength() < 2) {
      throw new TiledPathException(this.loggerBreadcrumbs, "Path contains less than two steps.");
    }

    if (!this.hasStep(other)) {
      throw new TiledPathException(this.loggerBreadcrumbs, "Point does not belong to path.");
    }

    const steps = this.getSteps();
    let distance = 0;

    for (let i = 0; i < steps.length; i += 1) {
      if (other.isOnLineBetween(steps[i], steps[i + 1])) {
        return distance + steps[i].distanceTo(other);
      }

      distance += steps[i].distanceTo(steps[i + 1]);
    }

    return distance;
  }

  getElementPositionAtDistance(distance: number): ElementPositionInterface<T> {
    let length = 0;
    let previous: ?ElementPositionInterface<T> = null;

    for (let current of this.getSteps()) {
      if (!previous) {
        previous = current;

        continue;
      }

      let stepLength = 0;

      stepLength = previous.distanceTo(current);
      length += stepLength;

      if (length === distance) {
        return current;
      }

      if (length > distance) {
        const previousLength = length - stepLength;
        const stepLengthPartial = distance - previousLength;
        const stepProgress = stepLengthPartial / stepLength;

        // add remaining distance
        return new ElementPosition<T>(
          previous.getX() + stepProgress * (current.getX() - previous.getX()),
          previous.getY() + stepProgress * (current.getY() - previous.getY()),
          previous.getZ() + stepProgress * (current.getZ() - previous.getZ())
        );
      }

      previous = current;
    }

    throw new TiledPathException(this.loggerBreadcrumbs, "Desired distance is beyond a path.");
  }

  getElementRotationAtDistance(distance: number): ElementRotationInterface<"radians"> {
    const elementPositionAtDistance = this.getElementPositionAtDistance(distance);
    const closestPreviousStep = this.getClosestPreviousStep(elementPositionAtDistance);
    const closestNextStep = this.getClosestNextStep(elementPositionAtDistance);

    return angle.theta<T>(closestPreviousStep, closestNextStep);
  }

  getLength(): number {
    let length = 0;
    let previous: ?ElementPositionInterface<T> = null;

    for (let current of this.getSteps()) {
      if (previous) {
        length += previous.distanceTo(current);
      }

      previous = current;
    }

    return length;
  }

  getSteps(): $ReadOnlyArray<ElementPositionInterface<T>> {
    return this.steps.slice(0);
  }

  hasStep(other: ElementPositionInterface<T>): boolean {
    if (this.hasStepExact(other)) {
      return true;
    }

    const steps = this.getSteps();

    if (steps.length < 2) {
      return false;
    }

    let previous = steps[0];

    for (let i = 1; i < steps.length; i += 1) {
      const current = steps[i];

      if (other.isOnLineBetween(previous, current)) {
        return true;
      }

      previous = current;
    }

    return false;
  }

  hasStepExact(other: ElementPositionInterface<T>): boolean {
    for (let step of this.getSteps()) {
      if (step.isEqual(other)) {
        return true;
      }
    }

    return false;
  }

  isEqual(other: TiledPathInterface<T>): boolean {
    const thisSteps = this.getSteps();
    const otherSteps = other.getSteps();

    if (thisSteps.length !== otherSteps.length) {
      return false;
    }

    for (let i = 0; i < thisSteps.length; i += 1) {
      if (!thisSteps[i].isEqual(otherSteps[i])) {
        return false;
      }
    }

    return true;
  }
}

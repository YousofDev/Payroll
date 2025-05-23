type Constructor<T = any> = new (...args: any[]) => T;

export class DependencyInjector {
  private dependencies: Map<
    Constructor | string,
    { dependency: Constructor | any; isSingleton: boolean }
  > = new Map();
  private singletons: Map<Constructor | string, any> = new Map();

  register<T extends string | Constructor<any>>(
    dependency: T,
    isSingleton: boolean = false
  ): void {
    const token =
      typeof dependency === "string" ? dependency.toLowerCase() : dependency;
    this.dependencies.set(token, { dependency, isSingleton });
  }

  resolve<T>(token: Constructor<T> | string): T {
    const actualToken = typeof token === "string" ? token.toLowerCase() : token;
    const dependencyInfo = this.dependencies.get(actualToken);

    if (!dependencyInfo) {
      throw new Error(
        `Dependency ${typeof token === "string" ? token : token.name} not found`
      );
    }

    const { dependency, isSingleton } = dependencyInfo;

    if (isSingleton) {
      let instance = this.singletons.get(actualToken);
      if (!instance) {
        instance = this.createInstance(dependency);
        this.singletons.set(actualToken, instance);
      }
      return instance as T;
    }

    return this.createInstance(dependency);
  }

  private createInstance<T>(dependency: Constructor<T> | T): T {
    if (typeof dependency === "function") {
      const constructor = dependency as Constructor<T>;
      const params = this.getConstructorParams(constructor);
      const resolvedParams = params.map((param) => this.resolveParam(param));
      return new constructor(...resolvedParams);
    }

    return dependency as T;
  }

  private resolveParam(param: Constructor | string): any {
    // Try resolving as the exact token (class constructor or string)
    if (this.dependencies.has(param)) {
      return this.resolve(param);
    }
    // If param is a class constructor, try its name
    if (typeof param !== "string") {
      const className = param.name;
      if (this.dependencies.has(className)) {
        return this.resolve(className);
      }
      // Try lowercase class name
      const lowerClassName = className.toLowerCase();
      if (this.dependencies.has(lowerClassName)) {
        return this.resolve(lowerClassName);
      }
    }
    // If param is a string, try capitalizing it
    const capitalizedParam =
      typeof param === "string"
        ? param.charAt(0).toUpperCase() + param.slice(1)
        : param;
    if (this.dependencies.has(capitalizedParam)) {
      return this.resolve(capitalizedParam);
    }
    // Try lowercase string
    const lowerParam = typeof param === "string" ? param.toLowerCase() : param;
    if (this.dependencies.has(lowerParam)) {
      return this.resolve(lowerParam);
    }
    throw new Error(
      `Dependency ${typeof param === "string" ? param : param.name} not found`
    );
  }

  private getConstructorParams(
    constructor: Constructor
  ): (Constructor | string)[] {
    // Build a map of class names to registered tokens
    const paramMap: { [key: string]: Constructor | string } = {};
    for (const [token, { dependency }] of this.dependencies) {
      if (typeof dependency === "function" && dependency.name) {
        paramMap[dependency.name.toLowerCase()] = token;
        paramMap[dependency.name] = token; // Support both cases
      } else if (typeof dependency === "string") {
        paramMap[dependency.toLowerCase()] = token;
        paramMap[dependency] = token;
      }
    }

    const paramNames =
      constructor
        .toString()
        .match(/constructor\s*\(([\s\S]*?)\)/)?.[1]
        .split(",")
        .map((param) => param.trim())
        .filter((param) => param) || [];

    return paramNames.map((param) => {
      const name = param.split(":")[0].trim();
      // Try to match parameter name to a registered dependency
      const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
      const lowerName = name.toLowerCase();
      // Check for exact class constructor match first
      for (const [token, { dependency }] of this.dependencies) {
        if (
          typeof dependency === "function" &&
          (dependency.name === name || dependency.name === capitalizedName)
        ) {
          return token; // Return the registered token (class or string)
        }
      }
      // Fallback to paramMap with case-insensitive matching
      return (
        paramMap[capitalizedName] || paramMap[lowerName] || capitalizedName
      );
    });
  }
}

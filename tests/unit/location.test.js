import { afterEach, describe, expect, test, vi } from "vitest";
import { labelForCoordinates, requestCurrentPosition } from "../../src/lib/location.js";

describe("location helpers", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("labelForCoordinates", () => {
    test("formats coordinates to three decimals", () => {
      expect(labelForCoordinates({ lat: 43.65321, lng: -79.38319 })).toBe(
        "Current area (43.653, -79.383)",
      );
    });

    test("pads short decimals with trailing zeros", () => {
      expect(labelForCoordinates({ lat: 43.6, lng: -79.38 })).toBe(
        "Current area (43.600, -79.380)",
      );
    });
  });

  describe("requestCurrentPosition", () => {
    test("resolves browser coordinates on success", async () => {
      vi.stubGlobal("navigator", {
        geolocation: {
          getCurrentPosition: (success) =>
            success({ coords: { latitude: 43.7, longitude: -79.4 } }),
        },
      });

      await expect(requestCurrentPosition()).resolves.toEqual({
        lat: 43.7,
        lng: -79.4,
      });
    });

    test("rejects when geolocation is unavailable", async () => {
      vi.stubGlobal("navigator", {});

      await expect(requestCurrentPosition()).rejects.toThrow(
        "Geolocation is unavailable in this browser.",
      );
    });

    test("rejects when permission is denied", async () => {
      vi.stubGlobal("navigator", {
        geolocation: {
          getCurrentPosition: (_success, failure) => failure(),
        },
      });

      await expect(requestCurrentPosition()).rejects.toThrow(
        "Location permission was denied.",
      );
    });

    test("rejects on timeout or position unavailable", async () => {
      vi.stubGlobal("navigator", {
        geolocation: {
          getCurrentPosition: (_success, failure) =>
            failure({ code: 2, message: "Position unavailable" }),
        },
      });

      await expect(requestCurrentPosition()).rejects.toThrow(
        "Location permission was denied.",
      );
    });
  });
});

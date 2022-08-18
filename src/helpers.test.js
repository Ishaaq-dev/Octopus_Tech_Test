const helpers = require("./helpers");
const test_data = require("./test_data/test_data");
const correct_responses = require("./test_data/correct_responses");

describe("filter_outages function", () => {
  describe("returns false", () => {
    it("when `outages` is not passed", () => {
      const response = helpers.filter_outages(null, test_data.npt_site_info);
      expect(response).toEqual(false);
    });

    it("when `outages` is not an array", () => {
      const response = helpers.filter_outages(
        "hello world",
        test_data.npt_site_info
      );
      expect(response).toEqual(false);
    });

    it("when `site_info` is not passed", () => {
      const response = helpers.filter_outages(test_data.outages, null);
      expect(response).toEqual(false);
    });

    it("when `site_info` does not contain `devices` array", () => {
      const response = helpers.filter_outages(test_data.outages, {
        incorrectly_formatted: "site_info_object",
      });
      expect(response).toEqual(false);
    });

    it("when `site_info` is not a json object", () => {
      const response = helpers.filter_outages(test_data.outages, "hello world");
      expect(response).toEqual(false);
    });
  });

  describe("returns outages_to_upload", () => {
    it("when paramters are correct", () => {
      const response = helpers.filter_outages(
        test_data.mock_outages,
        test_data.mock_site_info
      );
      expect(response).toEqual(correct_responses.mock_outages_to_upload);
    });

    it("when parameters are correct", () => {
      const response = helpers.filter_outages(
        test_data.outages,
        test_data.npt_site_info
      );
      expect(response).toEqual(correct_responses.outages_to_upload);
    });
  });

  describe("returns an empty array", () => {
    it("when `outages` is empty", () => {
      const response = helpers.filter_outages([], test_data.mock_site_info);
      expect(response).toEqual([]);
    });

    it("when `site_info.devices have no outages", () => {
      const response = helpers.filter_outages(
        test_data.mock_outages,
        test_data.mock_site_info_no_outages
      );
      expect(response).toEqual([]);
    });

    it("when `site_info.devices` has no devices", () => {
      const response = helpers.filter_outages(
        test_data.mock_outages,
        test_data.mock_site_info_no_devices
      );
      expect(response).toEqual([]);
    });
  });
});

describe("get_device_name function", () => {
  describe("returns the correct device name", () => {
    it("when passed an id and list of devices", () => {
      const response = helpers.get_device_name(
        test_data.npt_devices,
        test_data.npt_device.id
      );
      expect(response).toEqual(test_data.npt_device.name);
    });
  });

  describe("returns false", () => {
    it("when id does not exist in devices list", () => {
      const response = helpers.get_device_name(
        test_data.npt_devices,
        "this_id_does_not_exist"
      );
      expect(response).toEqual(false);
    });
  });
});

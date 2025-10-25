# QR Sever

This is a simple nodejs server that mocks https://goqr.me/api/


## Usage

1. Clone the repo
2. Run `npm install`
3. Run the code `npm run start` or `node index.js`

The server will start on port 3000 (by default, or taken from PORT env)

### Endpoints

#### Generate QR Code

`GET /v1/create-qr-code/`

##### Query Parameters

| Name   | Type   | Required | Description |
|--------|--------|----------|-------------|
| data   | string | Yes      | The data or text to encode in the QR code |
| size   | string | No       | QR size in `WIDTHxHEIGHT` format (default: `200x200`) |


##### Size Validation Rules

- `size` must be in the format `NUMBERxNUMBER` (e.g. `300x300`)
- Width and height must be **positive integers**
- Width and height **must not exceed 10,000**
- Example valid sizes: `200x200`, `500x400`, `800x800`
- Example invalid sizes: `-200x200`, `200`, `bigxsmall`, `20000x20000`


##### Example Request

GET http://localhost:3000/v1/create-qr-code/?data=HelloWorld&size=300x300

Response:

![QR Response](/public/image.png)


###### Success

- **Status:** `200 OK`
- **Content-Type:** `image/png`
- **Body:** Binary PNG QR code

###### Error Responses

| Status Code        | Description                         |
|--------------------|--------------------------------------|
| 400 Bad Request    | Missing `data` parameter             |
| 400 Bad Request    | Invalid `size` parameter             |
| 400 Bad Request    | `size` too large (> 10000)          |
| 500 Internal Error | Failed to generate QR code          |
| 404 Not Found      | Invalid endpoint                     |

##### Example Error: Missing Data

```json
{
  "error": "Missing data parameter"
}
```

## Background

This was quickly built for RITU 2025 ticketing system. For mailing the tickets, I initially used [this api](https://goqr.me/api/). And had to sent about 1500 tickets, each ticket had 3 QR Codes.

On the first round (with just 86 tickets) the `qoqr` api hit its rate limit, causing two tickets to fail. So I knew I couldn't use this API anymore, I initially searched for other alternatives and almost all had this rate limiting.

So I built this (more like chatgpt did). This mocked the working of `goqr` apis as the app script that sends the emails used it for size control and other stuffs and I didn't want to break the app script. So it mocks goqr api for the basic stuffs.

Then I tunneled the sever endpoints using [cloudflare tunnels](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/). And replaced the `goqr` end point with the cloudflare tunnel url. All this in about 10mins or less.
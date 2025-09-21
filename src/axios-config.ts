import axios, { AxiosInstance } from "axios";
import { CookieJar } from "tough-cookie";
import { wrapper } from "axios-cookiejar-support";
import headersConfig from "../headers.json";

export interface LinkedInHeaders {
  [key: string]: string;
}

class LinkedInApiClient {
  private axiosInstance: AxiosInstance;
  private cookieJar: CookieJar;

  constructor() {
    this.cookieJar = new CookieJar();

    this.axiosInstance = wrapper(
      axios.create({
        baseURL: "https://www.linkedin.com/sales-api",
        timeout: 30000,
        jar: this.cookieJar,
        withCredentials: true,
      })
    );

    this.setupRequestInterceptor();
    this.setupResponseInterceptor();
  }

  private setupRequestInterceptor(): void {
    this.axiosInstance.interceptors.request.use(
      (config) => {
        Object.assign(config.headers, headersConfig.common);
        config.headers["Cookie"] = headersConfig.cookie;

        // Debug logging
        console.log("Request URL:", config.url);
        

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  private setupResponseInterceptor(): void {
    this.axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        console.error("LinkedIn API Error:", {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          url: error.config?.url,
        });
        return Promise.reject(error);
      }
    );
  }

  public async searchPeople(params: {
    start?: number;
    count?: number;
    leadListId?: string;
    [key: string]: any;
  }): Promise<any> {
    // Default lead list ID if not provided
    const leadListId = params.leadListId || "7371658687360155648";
    
    const queryString = `q=peopleSearchQuery&query=(spotlightParam:(selectedType:ALL),doFetchSpotlights:true,doFetchHits:true,doFetchFilters:false,pivotParam:(com.linkedin.sales.search.LeadListPivotRequest:(list:urn%3Ali%3Afs_salesList%3A${leadListId},sortCriteria:CREATED_TIME,sortOrder:DESCENDING)),list:(scope:LEAD,includeAll:false,excludeAll:false,includedValues:List((id:${leadListId}))))&start=${
      params.start || 0
    }&count=${params.count || 25}`;

    const response = await this.axiosInstance.get(
      `/salesApiPeopleSearch?${queryString}`,
      {
        headers: headersConfig.search,
      }
    );

    return response.data;
  }

  public async sendConnectionRequest(data: {
    member: string;
    message: string;
  }): Promise<any> {
    const response = await this.axiosInstance.post(
      "/salesApiConnection?action=connectV2",
      JSON.stringify(data),
      {
        headers: headersConfig.connect,
      }
    );

    return response.data;
  }

  public updateCookies(newCookies: string): void {
    this.cookieJar = new CookieJar();
    this.axiosInstance.defaults.jar = this.cookieJar;
  }

  public getCookieJar(): CookieJar {
    return this.cookieJar;
  }
}

export const linkedInApiClient = new LinkedInApiClient();
export default linkedInApiClient;

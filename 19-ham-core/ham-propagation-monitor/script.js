/**
 * Workshop DIY — Template v1.2
 * Themes · i18n · RTL · Log · Toast · Status · Panels · Sound
 * Easter eggs: Konami, Morse, Matrix rain, Debug, Shake report, Time-travel, Typewriter
 */

const $ = id => document.getElementById(id);

/* ═══════ LOGO SVG (injected once) ═══════ */

const LOGO_SVG = `<svg preserveAspectRatio="xMidYMid meet" role="img" aria-label="Workshop DIY" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="77.139885 78.322945 253.991455 136.254120"> <path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M187.423706,152.869797C187.478333,152.738831,187.655853,152.631668,187.818207,152.631668C188.090317,152.631668,190.483124,151.543793,191.616806,150.904663C191.883423,150.754349,193.032593,149.992432,194.170502,149.211517C197.431274,146.973755,199.240906,146.236755,202.587189,145.783752C203.799835,145.619583,204.629318,145.619736,205.933762,145.784378C212.620331,146.628281,217.423569,150.723984,219.325882,157.203781C219.72139,158.550934,219.771454,162.692093,219.406631,163.88208C218.187943,167.857361,216.579514,170.301239,213.792847,172.411835C209.455261,175.697083,203.83429,176.563141,198.809494,174.720413C197.244873,174.146637,196.144424,173.544434,194.478638,172.350433C191.905991,170.506454,190.53334,169.740753,188.031555,168.754135L187.293335,168.462997L187.308884,160.785461C187.317429,156.56282,187.36911,153.000763,187.423706,152.869797zM208.415588,151.261307L201.927002,151.261307L201.927002,154.5056L208.415588,154.5056L208.415588,151.261307zM195.438385,167.485199L192.194092,167.485199L192.194092,151.263702L195.438385,151.263702L195.438385,167.485199zM214.904205,167.485199L211.659897,167.485199L211.659897,151.263702L214.904205,151.263702L214.904205,167.485199zM201.927002,173.973801L198.682693,173.973801L198.682693,164.240906L205.171295,164.240906L205.171295,160.996597L201.927002,160.996597L201.927002,157.752304L208.415588,157.752304L208.415588,167.485199L201.927002,167.485199L201.927002,173.973801z"/> <path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M173.301086,159.585083C173.612106,158.491119,173.874039,158.032059,174.626434,157.262268C175.395889,156.475021,176.401733,155.870239,176.941635,155.870239C177.36203,155.870239,177.647339,155.263535,177.647339,154.369537C177.647339,153.240067,178.097351,153.01268,180.332611,153.01268C181.328247,153.01268,182.282974,153.064713,182.454239,153.128311C182.730774,153.231003,182.765625,154.070618,182.765625,160.629913C182.765625,166.947327,182.723099,168.050049,182.471725,168.251938C182.069794,168.574738,178.407364,168.435822,177.965607,168.081009C177.75119,167.908813,177.647324,167.518738,177.647324,166.885712L177.647324,165.94603L176.584106,165.490997C175.198334,164.897919,174.243912,164.070435,173.733398,163.019424C173.265182,162.055481,173.060654,160.43071,173.301086,159.585083z"/> <path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M153.601929,182.059692C154.740814,179.364502,156.707062,177.959259,159.536469,177.818451C160.701721,177.760437,161.251312,177.831604,162.144165,178.156082C163.450592,178.630859,165.150406,180.036514,165.749542,181.137527L166.150391,181.874146L171.23761,181.874146C175.554565,181.874146,176.349976,181.830872,176.490891,181.588379C176.673401,181.274307,177.547806,179.367874,178.631622,176.921021C179.274582,175.469437,179.523499,174.921753,180.081848,173.730072L180.595093,172.634674L182.95993,172.634674C184.912933,172.634674,185.324768,172.683594,185.324768,172.915649C185.324768,173.07019,185.049423,173.777435,184.712891,174.487305C184.376358,175.197189,183.943024,176.163757,183.749908,176.635269C183.556793,177.106766,183.115692,178.092621,182.769699,178.826065C182.423691,179.559509,182.025787,180.416779,181.885452,180.73111C181.745102,181.045441,181.453796,181.6884,181.238083,182.159897C181.022369,182.631409,180.643311,183.488678,180.395737,184.064957C179.824722,185.394073,179.204605,186.048218,178.254486,186.3237C177.765457,186.465485,175.502716,186.541504,171.771988,186.541504L166.040741,186.541504L165.659912,187.255905C165.138397,188.234222,163.85675,189.437042,162.748398,189.988312C161.961212,190.379837,161.551163,190.446259,159.943237,190.442749C158.273651,190.439087,157.93721,190.378052,156.97731,189.904602C155.279343,189.067123,154.253754,187.938721,153.568604,186.154144C153.151855,185.06868,153.167999,183.086639,153.601929,182.059692z"/> <path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M153.70961,134.681961C154.933441,131.8022,158.021027,130.114639,160.98288,130.70665C163.119888,131.133804,164.512604,132.063324,165.540604,133.74852L166.13118,134.71666L172.036896,134.724625C179.724121,134.734985,179.189514,134.531769,180.806213,138.05806C181.046387,138.58194,181.506516,139.56781,181.828705,140.248856C182.150894,140.929916,182.572266,141.873413,182.765106,142.34552C182.957932,142.817627,183.418945,143.846344,183.789566,144.631577C184.160187,145.416794,184.582855,146.359299,184.72879,146.726013C184.874741,147.092743,185.068542,147.474228,185.159454,147.573761C185.250381,147.673309,185.324768,147.911697,185.324768,148.103516C185.324768,148.42543,185.139572,148.448166,182.920441,148.398804C180.143387,148.337021,180.601318,148.697861,179.105072,145.392487C178.607056,144.292328,177.979095,142.920685,177.709595,142.344406C177.440109,141.768127,177.087021,140.996597,176.924942,140.629868C176.762878,140.263153,176.561615,139.834503,176.477676,139.677338C176.349091,139.436539,175.522827,139.383606,171.225388,139.340881L166.125702,139.290192L165.734726,140.000244C165.222015,140.931427,163.772217,142.287949,162.807831,142.738846C160.99057,143.588516,158.677109,143.612717,156.992996,142.799698C155.47348,142.066116,154.281479,140.67366,153.456284,138.668228C153.079697,137.753036,153.198425,135.884811,153.70961,134.681961z"/> <path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M142.359467,157.940231C142.509399,157.475464,142.773041,156.807739,142.945313,156.45639C143.301086,155.73085,144.960602,154.086121,145.719666,153.706772C147.453094,152.840485,150.120728,152.779083,151.897141,153.564621C153.038162,154.069183,154.633179,155.561859,155.143616,156.602798L155.49057,157.310364L162.396606,157.310364L169.302643,157.310364L169.245392,159.621033L169.188141,161.931702L162.336823,161.983459L155.485474,162.035233L154.951477,162.917023C154.333344,163.937775,152.845825,165.267944,151.815979,165.720886C151.320953,165.938599,150.48027,166.037445,149.070404,166.043716C147.337799,166.051422,146.909668,165.986923,146.165497,165.606079C144.226196,164.613617,142.876617,163.016098,142.361877,161.103683C141.998642,159.754135,141.998108,159.060349,142.359467,157.940231z"/> <path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M259.791718,157.665863L264.87912,148.034195L272.338226,148.034195L263.03244,163.730896L263.03244,174.991974L256.261322,174.991974L256.261322,164.07489L246.792618,148.034195L254.505173,148.034195L259.791718,157.665863z"/> <path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M240.369812,152.741394L236.495438,152.741394L236.495438,170.284775L240.369812,170.284775L240.369812,174.991974L225.849915,174.991974L225.849915,170.284775L229.724304,170.284775L229.724304,152.741394L225.849915,152.741394L225.849915,148.034195L240.369812,148.034195L240.369812,152.741394z"/> <path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M330.789734,195.730286L203.964523,195.730286L203.964523,199.334839L330.789734,199.334839L330.789734,195.730286z"/> <path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M330.789551,203.350861L161.68924,203.350861L161.68924,206.955414L330.789551,206.955414L330.789551,203.350861z"/> <path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M330.790314,210.972504L77.139885,210.972504L77.139885,214.577057L330.790314,214.577057L330.790314,210.972504z"/> <path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M199.007599,92.751289L211.076767,107.812828L202.108658,108.433113L193.221268,96.996552L191.912918,99.119194L192.604614,109.090935L185.184021,109.604782L183.137482,80.08474L190.55806,79.571373L191.466415,92.675797L200.002396,78.91729L208.593674,78.322945L199.007599,92.751289z"/> <path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M234.138016,81.615562C236.040375,81.751511,237.914093,82.153725,239.704468,82.81044C242.302017,83.709618,244.733612,85.0299,246.901871,86.718407L245.150757,93.244476L244.516693,93.074516L244.196808,92.630768C242.70787,90.69416,240.767151,89.152077,238.543442,88.138672C237.43634,87.647743,236.259094,87.333046,235.05455,87.206039C234.227158,87.13401,233.394257,87.239655,232.611099,87.515953C232.1866,87.685104,231.808258,87.952736,231.507553,88.296593C230.788803,89.172775,230.813843,90.439911,231.566635,91.287064C232.032272,91.758965,232.559708,92.165504,233.134735,92.49572C233.880844,92.934601,234.641342,93.348839,235.414795,93.73764L236.692566,94.414246C238.063751,95.136879,239.357956,95.996429,240.555618,96.979881C241.421173,97.700912,242.148926,98.572769,242.70343,99.552994C243.199982,100.455551,243.47139,101.464417,243.494675,102.49408C243.516479,104.315857,243.04805,106.109734,242.138275,107.688644C241.268204,109.142014,239.979233,110.299194,238.440216,111.008636C236.697495,111.816132,234.786774,112.195747,232.867447,112.115822C231.006363,112.044464,229.16304,111.7258,227.386139,111.168236C225.295883,110.581566,223.299759,109.70047,221.458069,108.551567C220.391022,107.90168,219.366867,107.183914,218.391983,106.402733L220.215729,99.607994L220.868774,99.782715L221.294846,100.371597C223.248032,102.98111,225.940598,104.943588,229.023956,106.004974C230.198563,106.381287,231.426422,106.56295,232.65976,106.542908C233.398315,106.50238,234.108765,106.246048,234.70285,105.805771C235.495346,105.106613,235.762222,103.987152,235.3703,103.006096C234.953918,102.254745,234.346375,101.627075,233.608734,101.186172C232.310593,100.437439,230.990005,99.728287,229.648743,99.059662L228.913788,98.6465C227.703781,97.972984,226.583435,97.149826,225.579315,96.196541C224.730804,95.402397,224.063187,94.435135,223.621811,93.360443C223.239136,92.341805,223.078842,91.253273,223.151657,90.167679C223.224899,88.937332,223.518707,87.730194,224.019104,86.603645C224.773438,84.973534,226.068161,83.653664,227.684143,82.867416C229.688202,81.891472,231.914063,81.459724,234.138016,81.615562z"/> <path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M158.184418,89.408417L158.63797,89.460617C160.159576,89.664032,161.581177,90.331436,162.709152,91.371941C163.457062,92.134872,164.054443,93.031792,164.469971,94.015739C164.905151,94.958809,165.210938,95.956268,165.379028,96.981071C165.586273,98.309639,165.448776,99.669395,164.979736,100.929688C164.526001,102.206253,163.843109,103.389481,162.9646,104.421295L177.202927,111.835213L168.925079,115.537735L156.954742,109.003616L154.522186,110.091713L158.959137,119.99498L152.206207,123.015327L140.106628,96.007126L150.980728,91.143959C152.423172,90.469635,153.929443,89.940933,155.477051,89.56575C156.366608,89.378746,157.27916,89.325714,158.184418,89.408417zM154.518402,95.879517C153.797302,95.981628,153.094345,96.184746,152.429993,96.482941C151.30661,96.954544,150.192154,97.445801,149.086243,97.956879L152.344727,105.230492C153.226166,104.854858,154.099228,104.460068,154.963409,104.046356C155.701569,103.707794,156.398712,103.2864,157.041443,102.79026C157.931732,102.040565,158.426819,100.923943,158.384399,99.761368C158.265366,98.633255,157.799194,97.57048,157.049652,96.718483C156.493423,96.132034,155.708206,95.817314,154.900574,95.857086L154.518402,95.879517z"/> <path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M272.812744,97.204483L266.643219,106.109734L274.967194,111.866898L281.13623,102.961639L287.252136,107.192093L270.397125,131.522263L264.281219,127.291809L271.751953,116.507477L263.428467,110.75032L255.957245,121.534653L249.841339,117.304688L266.69635,92.974518L272.812744,97.204483z"/> <path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M123.532295,113.696442L124.230148,113.777771C126.158524,114.073517,128.005737,114.761353,129.657501,115.798744C132.481201,117.587387,134.876709,119.973488,136.675644,122.789276C137.85083,124.63147,138.576599,126.723907,138.794327,128.897644C139.033569,131.465439,138.466858,134.044128,137.172913,136.275513C135.587463,138.969635,133.343018,141.21608,130.649414,142.80484C127.777443,144.458344,124.36438,144.902039,121.164574,144.037842C119.23671,143.51442,117.427086,142.626587,115.833755,141.422424C113.593025,139.763062,111.674324,137.709213,110.171577,135.361511C108.996712,133.520187,108.266281,131.430969,108.038124,129.259201C107.781654,126.690132,108.338432,124.10524,109.629959,121.869064C111.213356,119.173782,113.45533,116.925095,116.146744,115.332764C118.378197,114.032959,120.960136,113.460907,123.532295,113.696442zM120.237076,120.379318L119.887573,120.406281C118.354965,120.610733,116.961685,121.401001,116.000389,122.611092C115.056374,123.703064,114.59684,125.132736,114.727959,126.569733C114.794571,127.523895,115.040863,128.456757,115.453972,129.31958C116.053543,130.618454,116.854576,131.814713,117.827431,132.864029C118.900902,134.079971,120.115646,135.163635,121.446014,136.092072C122.648727,136.917191,124.021584,137.461685,125.463211,137.685394C127.280067,137.943146,129.110855,137.312714,130.383087,135.991302C131.89679,134.496063,132.46991,132.291229,131.875671,130.248962C131.491013,128.764099,130.784729,127.381737,129.806686,126.199554C128.542725,124.617355,127.058746,123.224152,125.399681,122.062111C124.287796,121.300659,123.037567,120.763733,121.719482,120.481628C121.230911,120.390747,120.733513,120.356422,120.237076,120.379318z"/> <path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M301.601013,126.300751L302.299225,126.387955C304.863129,126.784752,307.239716,127.969833,309.098511,129.778381C311.170715,131.775146,312.75058,134.224945,313.714081,136.935547C314.870911,140.295837,314.546234,143.989166,312.820984,147.096512C311.958069,148.639557,310.845917,150.029465,309.529388,151.210129C307.452698,153.100769,305.048676,154.597107,302.434753,155.626007C300.399414,156.423401,298.204712,156.731628,296.028259,156.525696C293.460388,156.265411,291.037109,155.212799,289.095093,153.514084C286.754761,151.440582,284.981323,148.806931,283.940704,145.859634C282.870056,142.725098,283.092163,139.293045,284.557861,136.322372C285.44342,134.53299,286.664185,132.92984,288.153931,131.599777C290.215515,129.722946,292.602142,128.237671,295.197113,127.216599C297.231812,126.41954,299.424255,126.105988,301.601013,126.300751zM301.796417,133.319016L301.395599,133.345963C299.740631,133.540878,298.142822,134.070938,296.699768,134.903717C295.098816,135.78006,293.62146,136.865036,292.306549,138.130219C291.264404,139.150299,290.465088,140.391296,289.96759,141.761612C289.36438,143.493225,289.630615,145.409592,290.682953,146.911621C291.859528,148.684113,293.91449,149.671082,296.034698,149.48201C297.567047,149.390991,299.06073,148.964966,300.410278,148.234055C302.207336,147.299255,303.861511,146.112946,305.322906,144.710876C306.284607,143.767151,307.052765,142.644867,307.584167,141.407135C308.377655,139.487228,308.077698,137.288376,306.798889,135.650696C305.90625,134.37352,304.502838,133.544434,302.952667,133.378418C302.570068,133.321472,302.182861,133.301575,301.796417,133.319016z"/> <path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M330.52771,174.938004C330.907135,176.376419,331.109863,177.855667,331.131348,179.343048C331.140991,180.913391,330.788269,182.464722,330.100525,183.876755C329.284912,185.402817,327.990417,186.61911,326.415833,187.338638C324.171936,188.395706,321.654877,188.72998,319.212524,188.295227C317.964203,188.048447,316.787842,187.521973,315.772491,186.755524C314.332245,185.751999,313.161652,184.409088,312.364532,182.845856C311.819153,181.800247,311.407227,180.69043,311.138458,179.542328L310.207031,175.759995L300.801575,178.072845L299.023926,170.85611L327.780579,163.784363L330.52771,174.938004zM315.575714,174.43985L315.699463,174.941345C315.911407,175.872101,316.160706,176.794067,316.446716,177.704803C316.734985,178.68222,317.291321,179.559418,318.052795,180.237213C318.620514,180.667114,319.293762,180.936279,320.001617,181.016113C321.123322,181.060883,322.237854,180.828857,323.248352,180.340271C324.14624,179.851425,324.777618,178.986908,324.96933,177.983337C325.126617,177.021484,325.083862,176.037781,324.843781,175.09317C324.644379,174.164948,324.426147,173.241089,324.189056,172.321732L315.575714,174.43985z"/> <path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M116.693192,163.543213L113.851212,171.179825L95.025467,169.25325L110.58651,179.953522L107.74453,187.590118L77.373581,184.299744L80.062973,177.072876L100.10704,180.173035L83.216843,168.597382L85.788689,161.686646L106.05442,164.191376L88.928635,153.248993L91.548454,146.207825L116.693192,163.543213z"/> </svg>`;


/* ═══════ FOOTER ICON (base64 PNG) ═══════ */

const FOOTER_ICON = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAABAGlDQ1BpY2MAABiVY2BgPMEABCwGDAy5eSVFQe5OChGRUQrsDxgYgRAMEpOLCxhwA6Cqb9cgai/r4lGHC3CmpBYnA+kPQKxSBLQcaKQIkC2SDmFrgNhJELYNiF1eUlACZAeA2EUhQc5AdgqQrZGOxE5CYicXFIHU9wDZNrk5pckIdzPwpOaFBgNpDiCWYShmCGJwZ3AC+R+iJH8RA4PFVwYG5gkIsaSZDAzbWxkYJG4hxFQWMDDwtzAwbDuPEEOESUFiUSJYiAWImdLSGBg+LWdg4I1kYBC+wMDAFQ0LCBxuUwC7zZ0hHwjTGXIYUoEingx5DMkMekCWEYMBgyGDGQCm1j8/yRb+6wAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QA/wD/AP+gvaeTAAAAB3RJTUUH6gMKAjgH2Wn1xgAADEhJREFUeNrtmXtsVNedx7/n3Nfce2eu5+kZezx+MOMZO2PjOOAHBNdAbAR2Uchjo6br7YISqFiiRFrSKIrUAGLdpJtEVTdSkaJVUsRuVEVyE2GSUqALbDYP0WR5WCU2sbFj3MTYBgebuWPPzL1n/wCzxPEjJgmj1c5HOn/NOb97vt9zH7/fb4AMGTJkyJAhQ4YMGTL8f4R8F0FOnDgBURTJ5OQkALCampp06/r+eeutt2Cz2RCNRrPdbvdPNU3ba7PZXnW5XJtLSkp8kiThscceS/c2vx+OHTsGn8+HgoKCQlVVD1JKDQAMAKOUGrIsHwkEAkG73Y4XXngh3dudk1t6BO6++26Ew2HujTfeeFnX9a2Msa8GJQRWq/V3brf7X0zTZABAKQUhBBzHwTCMSZ7nvygtLb0Yj8fZoUOH0u3DwohGoygrKyuUJKkX109++qCUpnieHxcEYWzaGBcEYdRisZzyer0/AICDBw+mW9LCiEQiKC0tXSyK4shsBnyTYbVa31y9erW8ZMmStGnhbmVRfn4+JEkyLl261JRMJv0zzeF5flCSpKMcx3USQroEQThvtVr/SikdAJBlmqbFNM1cXdffGxoa6n3mmWdw9OjRtBmxIB555BEAgNvt/lue58cx7WR5no+53e4tr7/+Or3nnnv4UCjENzU1CY8//rj84IMPyna7/Z8JIQwAs9lsezdv3iysXLky3bIWxtKlS9HQ0CC4XK6tkiR18TyvcxwXkyTprMfj+emGDRvE+vr6r63zer0oKCioEAThrwCYIAiDeXl5d2VnZ6dFxy09AgDw+eefIxKJmGVlZR/ruv6WIAh/UFX13zwez6/Xrl17bHx83Jjp7V5TU4OHH3545P333w8lEomljDErpXRsZGTk8Icffoienp7basB3kgkuFLvdDlmWVwwPD+9PpVIOURR78vLy1iaTye4LFy58bf6KFStgs9m4c+fO+ePxeDiVShUCUE3THLZYLN1Op/PT1tbW0fb2drzyyivpkLQw7rzzTtTX10s2m+3fOY5jPM+bHo/nZwCwY8eOG/Nqa2tx77330kAgUKNp2iuiKHZzHBenlDJCCKOUGjzPfynL8gm73f50KBQKAMC2bdvSLXFuPvroI8iyjOLi4ny/3/83Lpfr4YKCgmWMMbJ7927s3LkTAFBSUpJtt9t3CYIwOPXSnG0QQkyLxXLK7XY379ixg6xevTrdMhfO8PAwQqEQlixZIhYWFq5yuVxtoiheJoSYuCnBEgRhRBCEIUEQhniev0wIMQkhSUEQRlVVPZebm/sQAKxfv37ea36jl2BLSwuWLVtGGGNWURSV6upq9PT0pHJzc3HgwIEFidy2bRueeuopDAwMqPF43BoIBMT6+vqk2+1mbW1t0sWLF9cMDAzsSiQSf+fz+XYxxg5PTEysY4xJAKAoyoVQKPQjURRfttvtr1JKP5yYmPghIaQvOzv7AdM0Px4fH3/W5/Od7OrqGmhtbcXhw4dv7UQ2bdoEl8uFwsLCfE3TfmmxWN4XBOG/FUV5x+12t9TU1Ejl5eULillUVIRgMOizWq1vchx3WlGUQyUlJYX5+fnIycmJiKI4AICpqvrpunXrsh0ORwXHcaNTd4Cqqr1VVVVLwuGwPxqN5ng8nrWU0nFCyEmO42wWi+VOSukVTdPeXLNmjbJ8+fI598PP9WN7eztsNltgcHDwXycnJxunip5kMonJycmVnZ2dRbW1tc/zPJ88efLkvOLz8/ORm5srdXV1rY7H442GYajJZPLLVCrlSCQSffF4XEilUtLU/OlFFgDE4/G8M2fO7GeMpa7PERlj1usGTa0zdV1v7OjoWKbr+p9uyYCGhgYcOXIEyWRy283ipzAMQ47FYv/4wQcfjMZisS6e5+kMYYjVav2yoaHho1OnTqUAuM6cOfMLXdd/ZBiGOiVS13XIsgyv16t0dnaK1xsrs0EAyABMACCEzKjBMAw1Ho83X7ly5U/bt2/HSy+9tDADxsbGUFVV5ezo6Gic6SQAIJVK2cfHx381tZnpMMY4XdePf/LJJ+u7u7tTdrt9aywW22ya5lfyD8MwYJomGGMU8+QmsiwPlJaW/kTX9Yscx5Hh4eHo0NDQXsYYmXZtJBKJOx544AGps7NzVkfprD9cq995QoiEOWCM8ddvw68NABzHcZzT6WTLly+XJiYm6qeLZ4zBNE2YpgnDMDCb2TcvSSQSMV3XRzs6Ojpjsdj52Q6AEKLFYjHBNM1Zg816B+Tk5KCuru5SV1fXx/F4PDqLSSmr1fqBKIqXkslkIhaL6YQQEEJAKQXHcdRms/0lGAymGGPs9OnTV2fZ6A0j5iMej+edPXv2gNVqPffQQw/d//bbb8/l2LxuzmrApk2b0NLSYjgcjt9MTEz8YHJysnD6pkVRfHvx4sWb33333cvd3d1s0aJF5vDwMHw+3415sVgMDQ0NaGlpgcfj+f3k5OSaVCql3Bxnqls01+lTSk1RFEcBmIwxieM4meO4+VL5kZycnMmRkZF5jZ2R++67D4wx+P3+1Yqi/CfHcZcJIaOCIAxpmrbP6/UGnE4ndu3aNW+s8vJyLFu2TPJ4PI/KstwxldzwPD8aCAQqCwoKEIlEakVRHMO0zyCl9Iqqqv01NTUrq6qqSqurq0vr6uoWMcaIzWarpJSO3fwZJISMEkKY3W7fDgBbtmy5NQMA4MUXXwQALF682OlwOCoEQbgrEAjcUVtbqwSDQRw/fvwbx3r22WcBAIsWLaoVBOESACaK4qWSkpKKYDCIcDhcKwjCGACmKEpvcXHxXXa7fS2ldFxV1e7GxsYcURT5rKysXJvNFrDb7XmapjVRSscppX/RNC2qKMo6QsiYIAj9gUCg1Ov1zrmn214NVlZWghCS1d/fv8UwjBJK6ZDD4XiREHJJFMXivr6+38bj8SoAhBAyCIAzDCNHVdXu+vr6Fe+9955L1/XfmaaZhWvPuGiapheAQSkdZIzxALxWq/W5K1eu/LyyspKdOnXqdstcOJs2bQJjDNFo1O1yuX4sy/J/UUpT+N8M8NPm5uZsq9VaQSm9kRnONFRVPRyJRHKKiormve4tN0S+Lffffz+i0agQDoe1aDRquXz5Mvnss89SdXV1eltbW0c4HN6fTCbHDcMoN01TFUXxclFR0at9fX22ZDK5kTFmmR6TEMJkWT7icDi2DQwMfPbcc8+hvb09XRJnp7GxEQDg9Xof1TTtpKZpp3Nzc38GAM8//zwAYNWqVdi6dSv1+/2rFEX5D5vN1lVYWFgty3IzpfQKvloKM0EQLmZlZf0yGAz6srKy8Nprr6Vb5uyEQiFEIhGPJEknADCO42Iej2e9IAhfSVn37dsHAKioqHD4/f573W73L1RV/aMoiv2U0s8lSepVFOW4w+H4p4KCgruam5u5+Yqf7xzGGJ5++mkMDQ2R8+fPE8bYnN/z3bt3AwDcbvdPKKVJXHvjH6murrZVVFTMuGaqT7hu3TqhrKzMEwgEgpqmFZeUlOTX1dWpBw4cQGtr6+0V/sQTT4DjOBQXF+c6nc5tmqa9pmnaPqfT+Q+hUMhjtVpnbE2Vl5ejqqrKpijKIVxrcCRdLtdGAHjyySdvr4hbZc+ePfB4PMjPzy9WFOUYpfTmjo2hKMrBoqKikMfjwdmzZ2+sO378OGRZhs/na+Y4LgaAWSyWP4fD4exgMJgWLbeUB1RWVsLv9/NHjx7do+v6ozP9Oaqq6pt5eXkvM8ZM4NqjYhgGrl69yo2NjW2Px+NNlFKWlZW1fXR09FdNTU145513/m8YEIlEQCkt6unpOZZIJPJnmkMpNTmO+1oZapomMU1TYowRURTP+f3+tYZh9Pb399928cAc5fCcrl0rYBRca0zMiGmaNJlMytOHYRgWxhghhDBRFF/v7e3tLSsrS4t4YJ6W2GxwHAdCyBeU0j4AnpnmCIIwKEnSGdxUklJKQSlliUTiqiAIHVlZWb9RVTUtt/63MmDp0qXYu3fvZafTuSeZTN4x1d66yaCYpmk/37lz529PnjxJGWOglEJVVXi9XiiKYmzcuNGIxWLIy8tLm3jgWxRDPp8PsiwLY2Njfx+LxR43DKMAAOE4blCW5Zc8Hs+ruq4nBwYG0irwezMAADZs2IDS0lLS1tbmNU0zQCmlkiR9UV1dfWF4eJjt378/3foyZMiQIUOGDBkyZMiQIcNM/A+SuM25qDqHNQAAAB50RVh0aWNjOmNvcHlyaWdodABHb29nbGUgSW5jLiAyMDE2rAszOAAAABR0RVh0aWNjOmRlc2NyaXB0aW9uAHNSR0K6kHMHAAAAAElFTkSuQmCC';
/* ═══════ LIGHT THEMES LIST ═══════ */

const LIGHT_THEMES = ['riad', 'medina'];

/* ═══════ APP VERSION ═══════ */

const APP_VERSION = '1.2';

/* ═══════ SOUND EFFECTS ═══════ */

let soundEnabled = false;
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;

function playSound(type) {
  if (!soundEnabled) return;
  if (!audioCtx) audioCtx = new AudioCtx();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  gain.gain.value = 0.08;
  const t = audioCtx.currentTime;
  switch (type) {
    case 'click':
      osc.frequency.value = 800; osc.type = 'sine';
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
      osc.start(t); osc.stop(t + 0.08); break;
    case 'success':
      osc.frequency.value = 523; osc.type = 'sine';
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
      osc.start(t); osc.stop(t + 0.3);
      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.connect(gain2); gain2.connect(audioCtx.destination);
      gain2.gain.value = 0.08; osc2.frequency.value = 659; osc2.type = 'sine';
      gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
      osc2.start(t + 0.15); osc2.stop(t + 0.4); break;
    case 'error':
      osc.frequency.value = 200; osc.type = 'square';
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      osc.start(t); osc.stop(t + 0.25); break;
  }
}

/* ═══════ i18n ═══════ */

const LANG = {
  en: {matrixTitle:'Matrix Rain',matrixOn:'Matrix ON',matrixOff:'Matrix OFF',ratingTitle:'Rate this app',ratingYours:'You rated',ratingThanks:'Thanks for rating!',flashTitle:'Flashcards',flashKnow:'Know it',flashReview:'Review later',flashDone:'All cards reviewed!',flashProgress:'{0} of {1} remaining',flash_t1:'Signal',flash_d1:'A detectable transmitted energy pattern used to convey information.',flash_t2:'Encryption',flash_d2:'The process of encoding data so only authorized parties can read it.',flash_t3:'Protocol',flash_d3:'A set of rules governing data exchange between devices or systems.',flash_t4:'Frequency',flash_d4:'The number of cycles per second of a periodic signal, measured in Hertz.',flash_t5:'Authentication',flash_d5:'The process of verifying the identity of a user, device, or system.',certTitle:'Certificate of Completion',certComplete:'Congratulations! All apps completed!',certProgress:'{0} of {1} apps completed',certDownload:'Download Certificate',certName:'Workshop DIY',annotTitle:'Annotation Mode',annotDraw:'Freehand',annotArrow:'Arrow',annotCircle:'Circle',annotText:'Text',annotUndo:'Undo',annotClear:'Clear All',annotSave:'Save as PNG',annotExit:'Exit Annotation',bookmarkTitle:'My Bookmarks',bookmarkAdd:'Add Bookmark',bookmarkRemove:'Remove',bookmarkCollection:'Add to Collection',bookmarkNew:'New Collection',bookmarkEmpty:'No bookmarks yet',morseSecret:'Morse Easter Egg',morseBackstory:'Legend has it a retired ham operator in New Zealand bounced a signal off the Moon in 1953, and this tool was inspired by his hand-drawn circuit diagrams found in an attic decades later.',morseDecoded:'Decoded: ',dnaTitle:'DNA Fingerprint',dnaSave:'Save DNA',dnaInfo:'Unique visual signature of current parameters',sandboxTitle:'Sandbox Mode',sandboxOn:'Sandbox ON',sandboxOff:'Sandbox OFF',sandboxAdd:'Add Parameter',sandboxReset:'Reset Defaults',profTitle:'Professor',profGreet:'Hello Agent! I\x27m Professor Workshop. Ask me anything about Ham Propagation Monitor!',profWhat:'What is this?',profHow:'How does it work?',profWhy:'Why is this important?',profChallenge:'Give me a challenge',profMore:'Tell me more',profQuiz:'Quiz me',profUnknown:'Good question! Try exploring the Ham Core features to find out.',profPlaceholder:'Ask the professor...',
    pomodoroTitle:'Pomodoro Timer',pomodoroFocus:'Focus',pomodoroBreak:'Break',pomodoroStart:'Start',pomodoroPause:'Pause',pomodoroReset:'Reset',pomodoroDone:'Session complete!',flipTitle:'Secret Stats',flipStats:'Hidden Statistics',flipTime:'Time Spent',flipChanges:'Parameter Changes',flipGame:'Click the Target',flipBack:'Flip Back',
    title: 'my-project', subtitle: '🚀 explore · 🎨 create · 💡 innovate',
    disconnected: 'Disconnected', connected: 'Connected',
    mainSection: 'Main Section', mainDesc: 'Describe your project here',
    sectionA: 'Section A', sectionB: 'Section B',
    activityLog: 'Activity Log', eventsMsg: 'Events & messages',
    clear: 'Clear', copy: 'Copy', theme: 'Theme',
    settings: '⚙️ Settings', language: 'Language',
    helpSettings: '❓ Help & Settings', settingsTab: '⚙️',
    help: '❓ Help', faq: 'FAQ', howto: 'How-To', wiki: 'Wiki',
    faq_q1: 'What is this app?', faq_a1: 'A Workshop-DIY educational web app. Explore, create, and innovate!',
    faq_q2: 'How do I change the theme?', faq_a2: 'Open Settings (⚙️) and pick a theme from the dropdown.',
    faq_q3: 'How do I change the language?', faq_a3: 'Open Settings (⚙️) and pick your language. Arabic enables RTL automatically.',
    faq_q4: 'Is my data private?', faq_a4: 'Yes. Everything runs locally in your browser. No data is sent anywhere.',
    howto_1: 'Explore the main section to get started with the app.',
    howto_2: 'Open collapsible sections to access more features.',
    howto_3: 'Check the Activity Log for events and messages.',
    howto_4: 'Use Settings (⚙️) to customize theme and language.',
    wiki_themes_title: '🎨 Themes', wiki_themes: '8 built-in themes: 6 dark (Mosque, Zellige, Andalus, Space, Jungle, Robot) and 2 light Islamic themes (Riad, Medina).',
    wiki_i18n_title: '🌐 Languages', wiki_i18n: 'Trilingual support: English, Français, العربية. Arabic automatically enables right-to-left layout.',
    wiki_log_title: '📜 Activity Log', wiki_log: 'Timestamped, color-coded log. Clear or copy to clipboard. Types: info, success, error, TX, RX.',
    wiki_privacy_title: '🔒 Privacy', wiki_privacy: 'Local-first, privacy-first. All data stays in your browser. No tracking, no analytics, no external calls.',
    working: 'Working…',
    t_mosque: 'Mosque', t_zellige: 'Zellige', t_andalus: 'Andalus',
    t_riad: 'Riad', t_medina: 'Medina',
    t_space: 'Space', t_jungle: 'Jungle', t_robot: 'Robot',
    ready: '🚀 App ready!',
    logCleared: 'Log cleared', copied: 'Copied!', copyFail: 'Copy failed',
    export: 'Export', filterAll: 'All',
    soundEffects: '🔊 Sound effects',
    whisperMode: 'Whisper mode', breathingGuide: 'Breathing guide', dhikrTap: 'Tap',
    musicMode: 'Music reactive', chatPlaceholder: 'Talk to the robot...',
    splashHint: 'tap to skip',
    newVersion: 'UPDATE',
    langChanged: '🌐 Language → English',
    themeChanged: '🎨 Theme →',
  },
  fr: {matrixTitle:'Pluie Matrix',matrixOn:'Matrix ACTIV\x27',matrixOff:'Matrix D\x27SACTIV\x27',ratingTitle:'Noter cette appli',ratingYours:'Votre note',ratingThanks:'Merci pour votre note !',flashTitle:'Cartes M\xe9moire',flashKnow:'Je sais',flashReview:'\xc0 revoir',flashDone:'Toutes les cartes r\xe9vis\xe9es !',flashProgress:'{0} sur {1} restantes',flash_t1:'Signal',flash_d1:'Un motif d\x27\xe9nergie transmis d\xe9tectable utilis\xe9 pour transmettre des informations.',flash_t2:'Chiffrement',flash_d2:'Le processus d\x27encodage des donn\xe9es pour que seules les parties autoris\xe9es puissent les lire.',flash_t3:'Protocole',flash_d3:'Un ensemble de r\xe8gles r\xe9gissant l\x27\xe9change de donn\xe9es entre appareils ou syst\xe8mes.',flash_t4:'Fr\xe9quence',flash_d4:'Le nombre de cycles par seconde d\x27un signal p\xe9riodique, mesur\xe9 en Hertz.',flash_t5:'Authentification',flash_d5:'Le processus de v\xe9rification de l\x27identit\xe9 d\x27un utilisateur, appareil ou syst\xe8me.',certTitle:'Certificat de R\xe9ussite',certComplete:'F\xe9licitations ! Toutes les apps termin\xe9es !',certProgress:'{0} sur {1} apps termin\xe9es',certDownload:'T\xe9l\xe9charger le Certificat',certName:'Workshop DIY',annotTitle:'Mode Annotation',annotDraw:'Main lev\x27e',annotArrow:'Fl\x27che',annotCircle:'Cercle',annotText:'Texte',annotUndo:'Annuler',annotClear:'Tout effacer',annotSave:'Enregistrer en PNG',annotExit:'Quitter l\x27annotation',bookmarkTitle:'Mes Favoris',bookmarkAdd:'Ajouter aux favoris',bookmarkRemove:'Supprimer',bookmarkCollection:'Ajouter \x27 la collection',bookmarkNew:'Nouvelle collection',bookmarkEmpty:'Aucun favori pour l\x27instant',morseSecret:'Morse Easter Egg',morseBackstory:'La legende raconte qu un operateur radio amateur retraite en Nouvelle-Zelande a fait rebondir un signal sur la Lune en 1953. Cet outil s inspire de ses schemas de circuits dessines a la main.',morseDecoded:'D\x27cod\x27: ',dnaTitle:'Empreinte ADN',dnaSave:'Sauvegarder ADN',dnaInfo:'Signature visuelle unique des param\x27tres actuels',sandboxTitle:'Mode Bac \x27 sable',sandboxOn:'Bac \x27 sable ACTIV\x27',sandboxOff:'Bac \x27 sable D\x27SACTIV\x27',sandboxAdd:'Ajouter Param\x27tre',sandboxReset:'R\x27initialiser',profTitle:'Professeur',profGreet:'Bonjour Agent ! Je suis le Professeur Atelier. Pose-moi n\x27importe quelle question sur Ham Propagation Monitor !',profWhat:'C\x27est quoi ?',profHow:'Comment \xe7a marche ?',profWhy:'Pourquoi c\x27est important ?',profChallenge:'Donne-moi un d\xe9fi',profMore:'Dis-moi plus',profQuiz:'Teste-moi',profUnknown:'Bonne question ! Essaie d\x27explorer les fonctions de Ham Core pour le d\xe9couvrir.',profPlaceholder:'Demande au professeur...',
    pomodoroTitle:'Minuteur Pomodoro',pomodoroFocus:'Concentration',pomodoroBreak:'Pause',pomodoroStart:'D\x27marrer',pomodoroPause:'Pause',pomodoroReset:'R\x27initialiser',pomodoroDone:'Session termin\x27e!',flipTitle:'Stats Secr\x27tes',flipStats:'Statistiques Cach\x27es',flipTime:'Temps Pass\x27',flipChanges:'Modifications',flipGame:'Cliquez la Cible',flipBack:'Retourner',
    title: 'mon-projet', subtitle: '🚀 explorer · 🎨 créer · 💡 innover',
    disconnected: 'Déconnecté', connected: 'Connecté',
    mainSection: 'Section Principale', mainDesc: 'Décrivez votre projet ici',
    sectionA: 'Section A', sectionB: 'Section B',
    activityLog: 'Journal', eventsMsg: 'Événements et messages',
    clear: 'Effacer', copy: 'Copier', theme: 'Thème',
    settings: '⚙️ Paramètres', language: 'Langue',
    helpSettings: '❓ Aide & Paramètres', settingsTab: '⚙️',
    help: '❓ Aide', faq: 'FAQ', howto: 'Guide', wiki: 'Wiki',
    faq_q1: 'C\'est quoi cette appli ?', faq_a1: 'Une appli éducative Workshop-DIY. Explore, crée et innove !',
    faq_q2: 'Comment changer le thème ?', faq_a2: 'Ouvre Paramètres (⚙️) et choisis un thème.',
    faq_q3: 'Comment changer la langue ?', faq_a3: 'Ouvre Paramètres (⚙️) et choisis ta langue. L\'arabe active le RTL automatiquement.',
    faq_q4: 'Mes données sont privées ?', faq_a4: 'Oui. Tout fonctionne localement dans ton navigateur. Rien n\'est envoyé nulle part.',
    howto_1: 'Explore la section principale pour démarrer.',
    howto_2: 'Ouvre les sections dépliables pour plus de fonctionnalités.',
    howto_3: 'Consulte le Journal pour les événements et messages.',
    howto_4: 'Utilise Paramètres (⚙️) pour personnaliser thème et langue.',
    wiki_themes_title: '🎨 Thèmes', wiki_themes: '8 thèmes intégrés : 6 sombres (Mosquée, Zellige, Andalous, Espace, Jungle, Robot) et 2 thèmes islamiques clairs (Riad, Médina).',
    wiki_i18n_title: '🌐 Langues', wiki_i18n: 'Support trilingue : English, Français, العربية. L\'arabe active automatiquement le mode droite-à-gauche.',
    wiki_log_title: '📜 Journal', wiki_log: 'Journal horodaté et coloré. Effacer ou copier. Types : info, succès, erreur, TX, RX.',
    wiki_privacy_title: '🔒 Confidentialité', wiki_privacy: 'Local-first, privacy-first. Toutes les données restent dans ton navigateur. Pas de tracking, pas d\'analytics.',
    working: 'En cours…',
    t_mosque: 'Mosquée', t_zellige: 'Zellige', t_andalus: 'Andalous',
    t_riad: 'Riad', t_medina: 'Médina',
    t_space: 'Espace', t_jungle: 'Jungle', t_robot: 'Robot',
    ready: '🚀 Application prête !',
    logCleared: 'Journal effacé', copied: 'Copié !', copyFail: 'Échec',
    export: 'Exporter', filterAll: 'Tout',
    soundEffects: '🔊 Effets sonores',
    whisperMode: 'Mode murmure', breathingGuide: 'Guide respiratoire', dhikrTap: 'Tap',
    musicMode: 'Réactif musique', chatPlaceholder: 'Parle au robot...',
    splashHint: 'appuyer pour passer',
    newVersion: 'MAJ',
    langChanged: '🌐 Langue → Français',
    themeChanged: '🎨 Thème →',
  },
  ar: {matrixTitle:'مطر الماتريكس',matrixOn:'الماتريكس مفعل',matrixOff:'الماتريكس معطل',ratingTitle:'قيّم هذا التطبيق',ratingYours:'تقييمك',ratingThanks:'شكرا على التقييم!',flashTitle:'بطاقات تعليمية',flashKnow:'أعرفها',flashReview:'راجع لاحقاً',flashDone:'تمت مراجعة جميع البطاقات!',flashProgress:'{0} من {1} متبقية',flash_t1:'إشارة',flash_d1:'نمط طاقة مرسل قابل للكشف يستخدم لنقل المعلومات.',flash_t2:'تشفير',flash_d2:'عملية ترميز البيانات بحيث لا يمكن قراءتها إلا للأطراف المصرح لها.',flash_t3:'بروتوكول',flash_d3:'مجموعة قواعد تحكم تبادل البيانات بين الأجهزة.',flash_t4:'تردد',flash_d4:'عدد الدورات في الثانية لإشارة دورية، تقاس بالهرتز.',flash_t5:'مصادقة',flash_d5:'عملية التحقق من هوية المستخدم أو الجهاز أو النظام.',certTitle:'شهادة إتمام',certComplete:'تهانينا! تم إكمال جميع التطبيقات!',certProgress:'{0} من {1} تطبيقات مكتملة',certDownload:'تحميل الشهادة',certName:'Workshop DIY',annotTitle:'وضع التعليق',annotDraw:'رسم حر',annotArrow:'سهم',annotCircle:'دائرة',annotText:'نص',annotUndo:'تراجع',annotClear:'مسح الكل',annotSave:'حفظ كصورة',annotExit:'خروج من التعليق',bookmarkTitle:'مفضلاتي',bookmarkAdd:'إضافة للمفضلة',bookmarkRemove:'إزالة',bookmarkCollection:'إضافة إلى مجموعة',bookmarkNew:'مجموعة جديدة',bookmarkEmpty:'لا توجد مفضلات بعد',morseSecret:'بيضة مورس الفصحية',morseBackstory:'تم اكتشاف هذه الأداة في خزنة سرية',morseDecoded:'تم فك التشفير: ',dnaTitle:'بصمة الحمض النووي',dnaSave:'حفظ البصمة',dnaInfo:'توقيع بصري فريد للمعلمات الحالية',sandboxTitle:'وضع التجربة',sandboxOn:'التجربة مفعلة',sandboxOff:'التجربة معطلة',sandboxAdd:'إضافة معلمة',sandboxReset:'إعادة التعيين',profTitle:'الأستاذ',profGreet:'مرحبا أيها العميل! أنا الأستاذ ورشة. اسألني أي شيء!',profWhat:'ما هذا؟',profHow:'كيف يعمل؟',profWhy:'لماذا هذا مهم؟',profChallenge:'أعطني تحديا',profMore:'أخبرني المزيد',profQuiz:'اختبرني',profUnknown:'سؤال جيد! حاول استكشاف الميزات لمعرفة الإجابة.',profPlaceholder:'اسأل الأستاذ...',
    pomodoroTitle:'مؤقت بومودورو',pomodoroFocus:'تركيز',pomodoroBreak:'استراحة',pomodoroStart:'بدء',pomodoroPause:'إيقاف',pomodoroReset:'إعادة',pomodoroDone:'اكتملت الجلسة!',flipTitle:'إحصائيات سرية',flipStats:'إحصائيات مخفية',flipTime:'الوقت المستغرق',flipChanges:'التغييرات',flipGame:'انقر الهدف',flipBack:'ارجع',
    title: 'مشروعي', subtitle: '🚀 استكشف · 🎨 أبدع · 💡 ابتكر',
    disconnected: 'غير متصل', connected: 'متصل',
    mainSection: 'القسم الرئيسي', mainDesc: 'صِف مشروعك هنا',
    sectionA: 'القسم أ', sectionB: 'القسم ب',
    activityLog: 'سجل النشاط', eventsMsg: 'الأحداث والرسائل',
    clear: 'مسح', copy: 'نسخ', theme: 'المظهر',
    settings: '⚙️ الإعدادات', language: 'اللغة',
    helpSettings: '❓ مساعدة وإعدادات', settingsTab: '⚙️',
    help: '❓ مساعدة', faq: 'أسئلة شائعة', howto: 'كيف تستخدم', wiki: 'ويكي',
    faq_q1: 'ما هذا التطبيق؟', faq_a1: 'تطبيق تعليمي من Workshop-DIY. استكشف، أبدع وابتكر!',
    faq_q2: 'كيف أغيّر المظهر؟', faq_a2: 'افتح الإعدادات (⚙️) واختر مظهرًا من القائمة.',
    faq_q3: 'كيف أغيّر اللغة؟', faq_a3: 'افتح الإعدادات (⚙️) واختر لغتك. العربية تفعّل الاتجاه من اليمين لليسار تلقائيًا.',
    faq_q4: 'هل بياناتي خاصة؟', faq_a4: 'نعم. كل شيء يعمل محليًا في متصفحك. لا يتم إرسال أي بيانات.',
    howto_1: 'استكشف القسم الرئيسي للبدء.',
    howto_2: 'افتح الأقسام القابلة للطي للمزيد من الميزات.',
    howto_3: 'تابع سجل النشاط للأحداث والرسائل.',
    howto_4: 'استخدم الإعدادات (⚙️) لتخصيص المظهر واللغة.',
    wiki_themes_title: '🎨 المظاهر', wiki_themes: '8 مظاهر مدمجة: 6 داكنة (مسجد، زليج، أندلس، فضاء، أدغال، روبوت) و2 مظهرين إسلاميين فاتحين (رياض، مدينة).',
    wiki_i18n_title: '🌐 اللغات', wiki_i18n: 'دعم ثلاثي اللغات: English، Français، العربية. العربية تفعّل تلقائيًا التخطيط من اليمين لليسار.',
    wiki_log_title: '📜 سجل النشاط', wiki_log: 'سجل مؤرّخ وملوّن. امسح أو انسخ. الأنواع: معلومات، نجاح، خطأ، إرسال، استقبال.',
    wiki_privacy_title: '🔒 الخصوصية', wiki_privacy: 'محلي أولًا، خصوصية أولًا. كل البيانات تبقى في متصفحك. بدون تتبع، بدون تحليلات.',
    working: 'جارٍ…',
    t_mosque: 'مسجد', t_zellige: 'زليج', t_andalus: 'أندلس',
    t_riad: 'رياض', t_medina: 'مدينة',
    t_space: 'فضاء', t_jungle: 'أدغال', t_robot: 'روبوت',
    ready: '🚀 التطبيق جاهز!',
    logCleared: 'تم مسح السجل', copied: 'تم النسخ!', copyFail: 'فشل النسخ',
    export: 'تصدير', filterAll: 'الكل',
    soundEffects: '🔊 مؤثرات صوتية',
    whisperMode: 'وضع الهمس', breathingGuide: 'دليل التنفس', dhikrTap: 'اضغط',
    musicMode: 'تفاعل موسيقي', chatPlaceholder: 'تحدث مع الروبوت...',
    splashHint: 'انقر للتخطي',
    newVersion: 'تحديث',
    langChanged: '🌐 اللغة ← العربية',
    themeChanged: '🎨 المظهر ←',
  }
};

/* ═══════ PROFESSOR CHAT ═══════ */
function initProfessorChat(){
  var L=LANG[document.documentElement.lang||'en'];
  if(!L||!L.profTitle)return;
  var appDir=location.pathname.split('/').filter(Boolean).slice(-2,-1)[0]||'app';
  var storageKey='profChat_'+appDir;
  var isOpen=false;
  var history=[];
  try{var saved=sessionStorage.getItem(storageKey);if(saved)history=JSON.parse(saved);}catch(e){}
  var greeted=history.length>0;

  /* ── floating button ── */
  var fab=document.createElement('button');
  fab.className='btn-icon-only';
  fab.setAttribute('aria-label',L.profTitle||'Professor');
  fab.textContent='\uD83C\uDF93';
  fab.style.cssText='position:fixed;bottom:18px;left:18px;z-index:10100;width:48px;height:48px;border-radius:50%;border:2px solid var(--accent,#d4af37);background:var(--card-bg,#1a1a2e);color:#fff;font-size:1.5rem;cursor:pointer;box-shadow:0 4px 15px rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;transition:transform 0.2s;';
  fab.onmouseenter=function(){fab.style.transform='scale(1.15)';};
  fab.onmouseleave=function(){fab.style.transform='scale(1)';};
  document.body.appendChild(fab);

  /* ── chat panel ── */
  var panel=document.createElement('div');
  panel.id='profChatPanel';
  panel.style.cssText='position:fixed;bottom:75px;left:18px;z-index:10101;width:300px;height:400px;background:var(--card-bg,#12121f);border:1px solid var(--accent,#d4af37);border-radius:12px;display:none;flex-direction:column;box-shadow:0 8px 32px rgba(0,0,0,0.6);font-family:inherit;overflow:hidden;';

  /* header */
  var hdr=document.createElement('div');
  hdr.style.cssText='display:flex;align-items:center;gap:8px;padding:10px 12px;background:rgba(212,175,55,0.12);border-bottom:1px solid rgba(212,175,55,0.2);flex-shrink:0;';
  var avatar=document.createElement('div');
  avatar.style.cssText='width:32px;height:32px;border-radius:50%;background:var(--accent,#d4af37);display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:0.9rem;color:#000;flex-shrink:0;';
  avatar.textContent='P';
  var hdrTitle=document.createElement('span');
  hdrTitle.style.cssText='font-weight:600;font-size:0.95rem;color:var(--text,#eee);flex:1;';
  hdrTitle.textContent=L.profTitle||'Professor';
  var closeBtn=document.createElement('button');
  closeBtn.textContent='\u2715';
  closeBtn.style.cssText='background:none;border:none;color:var(--text,#aaa);font-size:1.1rem;cursor:pointer;padding:2px 6px;';
  closeBtn.onclick=function(){togglePanel(false);};
  hdr.appendChild(avatar);hdr.appendChild(hdrTitle);hdr.appendChild(closeBtn);
  panel.appendChild(hdr);

  /* messages area */
  var msgs=document.createElement('div');
  msgs.id='profMsgs';
  msgs.style.cssText='flex:1;overflow-y:auto;padding:10px;display:flex;flex-direction:column;gap:8px;';
  panel.appendChild(msgs);

  /* quick buttons */
  var qbar=document.createElement('div');
  qbar.style.cssText='display:flex;flex-wrap:wrap;gap:4px;padding:6px 10px;border-top:1px solid rgba(255,255,255,0.08);flex-shrink:0;';
  var quickKeys=[
    {key:'profWhat',fallback:'What is this?'},
    {key:'profHow',fallback:'How does it work?'},
    {key:'profWhy',fallback:'Why is this important?'},
    {key:'profChallenge',fallback:'Give me a challenge'}
  ];
  quickKeys.forEach(function(q){
    var qb=document.createElement('button');
    qb.textContent=L[q.key]||q.fallback;
    qb.style.cssText='font-size:0.7rem;padding:3px 8px;border-radius:12px;border:1px solid rgba(212,175,55,0.3);background:rgba(212,175,55,0.08);color:var(--text,#ccc);cursor:pointer;white-space:nowrap;';
    qb.onclick=function(){handleUserMsg(L[q.key]||q.fallback);};
    qbar.appendChild(qb);
  });
  panel.appendChild(qbar);

  /* input area */
  var ibar=document.createElement('div');
  ibar.style.cssText='display:flex;gap:6px;padding:8px 10px;border-top:1px solid rgba(255,255,255,0.08);flex-shrink:0;';
  var inp=document.createElement('input');
  inp.type='text';
  inp.placeholder=L.profPlaceholder||'Ask the professor...';
  inp.style.cssText='flex:1;padding:6px 10px;border-radius:8px;border:1px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.06);color:var(--text,#eee);font-size:0.85rem;outline:none;';
  inp.onkeydown=function(e){if(e.key==='Enter'&&inp.value.trim()){handleUserMsg(inp.value.trim());inp.value='';}};
  var sendBtn=document.createElement('button');
  sendBtn.textContent='\u27A4';
  sendBtn.style.cssText='padding:6px 10px;border-radius:8px;border:1px solid var(--accent,#d4af37);background:rgba(212,175,55,0.15);color:var(--accent,#d4af37);cursor:pointer;font-size:0.9rem;';
  sendBtn.onclick=function(){if(inp.value.trim()){handleUserMsg(inp.value.trim());inp.value='';}};
  ibar.appendChild(inp);ibar.appendChild(sendBtn);
  panel.appendChild(ibar);
  document.body.appendChild(panel);

  /* ── helpers ── */
  function addBubble(text,isUser,typewriter){
    var bub=document.createElement('div');
    bub.style.cssText='max-width:85%;padding:8px 12px;border-radius:10px;font-size:0.82rem;line-height:1.45;word-wrap:break-word;'+(isUser?'align-self:flex-end;background:rgba(212,175,55,0.18);color:var(--text,#eee);':'align-self:flex-start;background:rgba(255,255,255,0.07);color:var(--text,#ddd);');
    msgs.appendChild(bub);
    msgs.scrollTop=msgs.scrollHeight;
    if(typewriter&&!isUser){
      var i=0;bub.textContent='';
      var iv=setInterval(function(){if(i<text.length){bub.textContent+=text[i];i++;msgs.scrollTop=msgs.scrollHeight;}else{clearInterval(iv);}},30);
    }else{
      bub.textContent=text;
    }
    return bub;
  }

  function saveHistory(){
    try{sessionStorage.setItem(storageKey,JSON.stringify(history.slice(-50)));}catch(e){}
  }

  function getAnswer(q){
    var ql=q.toLowerCase();
    /* What is this? */
    if(ql.indexOf('what')>=0||ql.indexOf('quoi')>=0||ql.indexOf('\u0645\u0627 ')>=0||ql===((L.profWhat||'').toLowerCase())){
      return L.mainDesc||L.subtitle||'This is an interactive workshop app.';
    }
    /* How does it work? */
    if(ql.indexOf('how')>=0||ql.indexOf('comment')>=0||ql.indexOf('marche')>=0||ql.indexOf('\u0643\u064a\u0641')>=0||ql===((L.profHow||'').toLowerCase())){
      var parts=[];
      if(L.step1Desc)parts.push(L.step1Desc);
      if(L.step2Desc)parts.push(L.step2Desc);
      if(L.step3Desc)parts.push(L.step3Desc);
      return parts.length?parts.join(' \u2192 '):(L.mainDesc||'Explore the controls to see how it works!');
    }
    /* Why is this important? */
    if(ql.indexOf('why')>=0||ql.indexOf('important')>=0||ql.indexOf('pourquoi')>=0||ql.indexOf('\u0644\u0645\u0627\u0630\u0627')>=0||ql===((L.profWhy||'').toLowerCase())){
      var r=L.purpose||'';
      if(!r){var lp=[];for(var k=1;k<=4;k++){if(L['learn'+k])lp.push(L['learn'+k]);}r=lp.join(' ');}
      return r||'Understanding these concepts builds real-world skills!';
    }
    /* Give me a challenge */
    if(ql.indexOf('challenge')>=0||ql.indexOf('d\xe9fi')>=0||ql.indexOf('\u062a\u062d\u062f\u064a')>=0||ql===((L.profChallenge||'').toLowerCase())){
      return L.challenge1||L.daily_d1||'Try changing every parameter and observe the results!';
    }
    /* Tell me more */
    if(ql.indexOf('more')>=0||ql.indexOf('plus')>=0||ql.indexOf('\u0627\u0644\u0645\u0632\u064a\u062f')>=0||ql===((L.profMore||'').toLowerCase())){
      var wk=[];for(var w=1;w<=5;w++){if(L['wiki'+w+'_title'])wk.push(L['wiki'+w+'_title']+': '+( L['wiki'+w+'_text']||''));}
      return wk.length?wk.join(' | '):(L.mainDesc||'Explore the Wiki tab for deeper knowledge!');
    }
    /* Quiz me */
    if(ql.indexOf('quiz')>=0||ql.indexOf('test')>=0||ql.indexOf('\u0627\u062e\u062a\u0628\u0631')>=0||ql===((L.profQuiz||'').toLowerCase())){
      if(typeof initQuizMode==='function'){try{initQuizMode();}catch(e){}}
      return L.quiz_q1||(L.challenge1?'Here is a challenge: '+L.challenge1:'Try the Quiz feature if available!');
    }
    /* Unknown */
    return L.profUnknown||'Good question! Try exploring the features to find out.';
  }

  function handleUserMsg(text){
    history.push({r:'u',t:text});
    addBubble(text,true,false);
    var answer=getAnswer(text);
    history.push({r:'p',t:answer});
    saveHistory();
    setTimeout(function(){addBubble(answer,false,true);},300);
  }

  function togglePanel(show){
    isOpen=typeof show==='boolean'?show:!isOpen;
    panel.style.display=isOpen?'flex':'none';
    if(isOpen&&!greeted){
      greeted=true;
      var greet=L.profGreet||('Hello Agent! I\x27m Professor Workshop. Ask me anything!');
      history.push({r:'p',t:greet});
      saveHistory();
      addBubble(greet,false,true);
    }
    if(isOpen)inp.focus();
  }

  /* restore history */
  function restoreHistory(){
    history.forEach(function(m){addBubble(m.t,m.r==='u',false);});
  }

  fab.onclick=function(){togglePanel();};

  /* restore on load if history exists */
  if(history.length>0){restoreHistory();}
}

document.addEventListener('DOMContentLoaded',function(){try{initProfessorChat();}catch(e){console.warn('ProfessorChat init:',e);}});


/* ═══════ POMODORO TIMER ═══════ */
function initPomodoro(){
  if(document.getElementById('pomodoroPanel'))return;
  var L=LANG[currentLang]||LANG.en;
  var appName=document.title||location.pathname.split('/').filter(Boolean).pop()||'unknown';
  var hdrBtns=document.querySelector('.header-buttons');
  if(!hdrBtns)return;
  var btn=document.createElement('button');
  btn.className='btn-icon-only';btn.id='pomodoroBtn';btn.textContent='\u{1F345}';btn.title=L.pomodoroTitle||'Pomodoro';
  hdrBtns.insertBefore(btn,hdrBtns.firstChild);
  var panel=document.createElement('div');panel.id='pomodoroPanel';
  panel.style.cssText='display:none;position:fixed;top:60px;right:16px;z-index:10000;background:var(--card,#1a1a2e);border:2px solid var(--accent,#e94560);border-radius:16px;padding:20px;min-width:220px;box-shadow:0 8px 32px rgba(0,0,0,0.5);font-family:inherit;color:var(--text,#eee);';
  panel.innerHTML='<div style="text-align:center;font-weight:700;font-size:1.1rem;margin-bottom:12px;" id="pomTitle">'+(L.pomodoroTitle||'Pomodoro')+'</div>'
    +'<div style="text-align:center;margin-bottom:8px;"><svg width="120" height="120" id="pomRingSvg"><circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="8"/><circle id="pomRing" cx="60" cy="60" r="52" fill="none" stroke="var(--accent,#e94560)" stroke-width="8" stroke-linecap="round" stroke-dasharray="326.73" stroke-dashoffset="0" transform="rotate(-90 60 60)" style="transition:stroke-dashoffset 1s linear;"/><text x="60" y="60" text-anchor="middle" dominant-baseline="central" fill="var(--text,#eee)" font-size="24" font-weight="700" id="pomTime">25:00</text></svg></div>'
    +'<div style="text-align:center;margin-bottom:8px;font-size:0.85rem;" id="pomMode">'+(L.pomodoroFocus||'Focus')+'</div>'
    +'<div style="display:flex;gap:6px;justify-content:center;margin-bottom:10px;">'
    +'<button id="pomStart" style="padding:6px 14px;border:none;border-radius:8px;background:var(--accent,#e94560);color:#fff;cursor:pointer;font-weight:600;">'+(L.pomodoroStart||'Start')+'</button>'
    +'<button id="pomPause" style="padding:6px 14px;border:none;border-radius:8px;background:#555;color:#fff;cursor:pointer;font-weight:600;display:none;">'+(L.pomodoroPause||'Pause')+'</button>'
    +'<button id="pomReset" style="padding:6px 14px;border:none;border-radius:8px;background:#333;color:#fff;cursor:pointer;font-weight:600;">'+(L.pomodoroReset||'Reset')+'</button></div>'
    +'<div style="text-align:center;font-size:0.8rem;opacity:0.7;" id="pomSessions">\u{1F345} 0</div>';
  document.body.appendChild(panel);
  var FOCUS=25*60,BREAK=5*60,remaining=FOCUS,running=false,isFocus=true,sessions=0,interval=null,circumf=2*Math.PI*52;
  var ring=document.getElementById('pomRing'),timeEl=document.getElementById('pomTime'),modeEl=document.getElementById('pomMode'),sessEl=document.getElementById('pomSessions');
  var startBtn=document.getElementById('pomStart'),pauseBtn=document.getElementById('pomPause'),resetBtn=document.getElementById('pomReset');
  function fmt(s){var m=Math.floor(s/60),ss=s%60;return String(m).padStart(2,'0')+':'+String(ss).padStart(2,'0');}
  function updateRing(){var total=isFocus?FOCUS:BREAK;var pct=remaining/total;ring.setAttribute('stroke-dashoffset',String(circumf*(1-pct)));}
  function tick(){
    if(!running)return;
    remaining--;timeEl.textContent=fmt(remaining);updateRing();
    if(remaining<=0){clearInterval(interval);running=false;
      startBtn.style.display='inline-block';pauseBtn.style.display='none';
      pomBeep();
      if(isFocus){sessions++;sessEl.textContent='\u{1F345} '+sessions;
        try{var k='pomodoro_'+appName;var d=JSON.parse(localStorage.getItem(k)||'[]');d.push({ts:Date.now(),app:appName});localStorage.setItem(k,JSON.stringify(d));}catch(e){}
        var mc=document.getElementById('mainCard');if(mc)mc.style.boxShadow='';
        isFocus=false;remaining=BREAK;modeEl.textContent=(LANG[currentLang]||LANG.en).pomodoroBreak||'Break';
        ring.setAttribute('stroke','#2ecc71');
      }else{isFocus=true;remaining=FOCUS;modeEl.textContent=(LANG[currentLang]||LANG.en).pomodoroFocus||'Focus';
        ring.setAttribute('stroke','var(--accent,#e94560)');
      }
      timeEl.textContent=fmt(remaining);updateRing();
    }
  }
  function pomBeep(){try{var ac=new(window.AudioContext||window.webkitAudioContext)();var o=ac.createOscillator();var g=ac.createGain();o.connect(g);g.connect(ac.destination);o.frequency.value=880;o.type='sine';g.gain.value=0.15;var t=ac.currentTime;g.gain.exponentialRampToValueAtTime(0.001,t+0.5);o.start(t);o.stop(t+0.5);}catch(e){}}
  startBtn.onclick=function(){if(running)return;running=true;interval=setInterval(tick,1000);startBtn.style.display='none';pauseBtn.style.display='inline-block';
    if(isFocus){var mc=document.getElementById('mainCard');if(mc)mc.style.boxShadow='0 0 20px rgba(233,69,96,0.4)';}};
  pauseBtn.onclick=function(){running=false;clearInterval(interval);startBtn.style.display='inline-block';pauseBtn.style.display='none';};
  resetBtn.onclick=function(){running=false;clearInterval(interval);isFocus=true;remaining=FOCUS;timeEl.textContent=fmt(remaining);ring.setAttribute('stroke-dashoffset','0');ring.setAttribute('stroke','var(--accent,#e94560)');modeEl.textContent=(LANG[currentLang]||LANG.en).pomodoroFocus||'Focus';startBtn.style.display='inline-block';pauseBtn.style.display='none';var mc=document.getElementById('mainCard');if(mc)mc.style.boxShadow='';};
  btn.onclick=function(){panel.style.display=panel.style.display==='none'?'block':'none';};
  document.addEventListener('click',function(e){if(!panel.contains(e.target)&&e.target!==btn&&panel.style.display==='block')panel.style.display='none';});
}

/* ═══════ 3D CARD FLIP ═══════ */
function initCardFlip(){
  var mc=document.getElementById('mainCard');if(!mc||mc.dataset.flipInit)return;mc.dataset.flipInit='1';
  var L=LANG[currentLang]||LANG.en;
  var appName=document.title||location.pathname.split('/').filter(Boolean).pop()||'unknown';
  var style=document.createElement('style');
  style.textContent='.flip-wrapper{perspective:1000px;}.flip-inner{position:relative;transform-style:preserve-3d;transition:transform 0.6s ease;}.flip-inner.flipped{transform:rotateY(180deg);}.flip-front,.flip-back{backface-visibility:hidden;}.flip-back{position:absolute;top:0;left:0;width:100%;height:100%;transform:rotateY(180deg);background:var(--card,#1a1a2e);border-radius:inherit;padding:20px;overflow-y:auto;box-sizing:border-box;color:var(--text,#eee);display:flex;flex-direction:column;gap:10px;}.flip-back h3{margin:0;font-size:1.2rem;color:var(--accent,#e94560);}.flip-back .stat-row{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.1);font-size:0.9rem;}.flip-target-area{position:relative;width:100%;height:120px;background:rgba(0,0,0,0.3);border-radius:8px;overflow:hidden;cursor:crosshair;}.flip-dot{position:absolute;width:20px;height:20px;background:#e94560;border-radius:50%;cursor:pointer;transition:none;}.flip-back-btn{padding:8px 16px;border:none;border-radius:8px;background:var(--accent,#e94560);color:#fff;cursor:pointer;font-weight:600;align-self:center;margin-top:auto;}';
  document.head.appendChild(style);
  var wrapper=document.createElement('div');wrapper.className='flip-wrapper';
  mc.parentNode.insertBefore(wrapper,mc);
  var inner=document.createElement('div');inner.className='flip-inner';
  wrapper.appendChild(inner);
  mc.classList.add('flip-front');inner.appendChild(mc);
  var back=document.createElement('div');back.className='flip-back';
  var timeKey='apptime_'+appName,changeKey='appchanges_'+appName,scoreKey='quizScore_'+appName;
  var timeSpent=0;try{timeSpent=parseInt(localStorage.getItem(timeKey)||'0');}catch(e){}
  var changes=0;try{changes=parseInt(localStorage.getItem(changeKey)||'0');}catch(e){}
  var bestScore=0;try{bestScore=parseInt(localStorage.getItem(scoreKey)||'0');}catch(e){}
  var facts=['Radio waves travel at the speed of light.','The first computer bug was a real moth.','WiFi stands for nothing - it is a brand name.','Bluetooth is named after a Viking king.','The first email was sent in 1971.','morse code SOS does not stand for anything.','A byte has 256 possible values.','The first webcam watched a coffee pot.','GPS needs 4 satellites for 3D positioning.','Arduino was named after a bar in Italy.'];
  var fact=facts[Math.floor(Math.random()*facts.length)];
  back.innerHTML='<h3>\u{1F510} '+(L.flipTitle||'Secret Stats')+'</h3>'
    +'<div class="stat-row"><span>'+(L.flipTime||'Time Spent')+'</span><span id="flipTimeVal">'+Math.floor(timeSpent/60)+'m '+timeSpent%60+'s</span></div>'
    +'<div class="stat-row"><span>'+(L.flipChanges||'Parameter Changes')+'</span><span>'+changes+'</span></div>'
    +'<div class="stat-row"><span>Best Quiz Score</span><span>'+bestScore+'%</span></div>'
    +'<div class="stat-row"><span>Achievements</span><span id="flipBadges">-</span></div>'
    +'<div style="font-size:0.85rem;"><strong>'+(L.flipGame||'Click the Target')+'</strong><div class="flip-target-area" id="flipTargetArea"></div><div style="text-align:center;margin-top:4px;font-size:0.8rem;" id="flipGameScore">Score: 0</div></div>'
    +'<div style="font-size:0.8rem;font-style:italic;opacity:0.7;">\u{1F4A1} '+fact+'</div>'
    +'<button class="flip-back-btn" id="flipBackBtn">\u{21A9}\uFE0F '+(L.flipBack||'Flip Back')+'</button>';
  inner.appendChild(back);
  var gameScore=0,gameActive=false;
  function spawnDot(){var area=document.getElementById('flipTargetArea');if(!area)return;area.innerHTML='';var dot=document.createElement('div');dot.className='flip-dot';dot.style.left=Math.random()*(area.offsetWidth-20)+'px';dot.style.top=Math.random()*(area.offsetHeight-20)+'px';dot.onclick=function(e){e.stopPropagation();gameScore++;var el=document.getElementById('flipGameScore');if(el)el.textContent='Score: '+gameScore;spawnDot();};area.appendChild(dot);}
  mc.addEventListener('dblclick',function(e){if(inner.classList.contains('flipped'))return;inner.classList.add('flipped');gameScore=0;var el=document.getElementById('flipGameScore');if(el)el.textContent='Score: 0';spawnDot();
    try{var badges=[];for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(k&&k.indexOf('badge_')===0){badges.push(k.replace('badge_',''));}}var bEl=document.getElementById('flipBadges');if(bEl)bEl.textContent=badges.length?badges.join(', '):'-';}catch(e){}});
  document.getElementById('flipBackBtn').onclick=function(e){e.stopPropagation();inner.classList.remove('flipped');};
  setInterval(function(){try{var v=parseInt(localStorage.getItem(timeKey)||'0');localStorage.setItem(timeKey,String(v+1));}catch(e){}},1000);
}


/* === MATRIX RAIN BACKGROUND === */
function initMatrixRain(){
 if(document.getElementById('matrixRainBtn'))return;
 var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
 var STORAGE_KEY='matrixRain_'+location.pathname;
 var canvas=null;var ctx=null;var animId=null;var active=false;
 var columns=[];var fontSize=14;var drops=[];
 var KATAKANA='\u30A2\u30A4\u30A6\u30A8\u30AA\u30AB\u30AD\u30AF\u30B1\u30B3\u30B5\u30B7\u30B9\u30BB\u30BD\u30BF\u30C1\u30C4\u30C6\u30C8\u30CA\u30CB\u30CC\u30CD\u30CE\u30CF\u30D2\u30D5\u30D8\u30DB\u30DE\u30DF\u30E0\u30E1\u30E2\u30E4\u30E6\u30E8\u30E9\u30EA\u30EB\u30EC\u30ED\u30EF\u30F2\u30F3';
 var LATIN='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
 var DIGITS='0123456789';
 var charPool=KATAKANA+LATIN+DIGITS;
 var kw=document.querySelector('meta[name="keywords"]');
 if(kw&&kw.content)charPool+=kw.content.replace(/[\s,]+/g,'').toUpperCase();
 var matrixBtn=document.createElement('button');matrixBtn.id='matrixRainBtn';matrixBtn.className='btn-icon-only';
 matrixBtn.textContent='\u25C9';matrixBtn.title=L.matrixTitle||'Matrix Rain';matrixBtn.style.cssText='cursor:pointer;font-size:1rem;';
 var hdr=document.querySelector('.header-buttons')||document.querySelector('.top-buttons')||document.querySelector('header');
 if(hdr)hdr.appendChild(matrixBtn);else{matrixBtn.style.cssText+='position:fixed;top:0.5rem;right:12rem;z-index:9999;';document.body.appendChild(matrixBtn);}
 function createCanvas(){
  canvas=document.createElement('canvas');canvas.id='matrixRainCanvas';
  canvas.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;pointer-events:none;';
  document.body.insertBefore(canvas,document.body.firstChild);
  ctx=canvas.getContext('2d');resize();
 }
 function resize(){
  if(!canvas)return;canvas.width=window.innerWidth;canvas.height=window.innerHeight;
  var cols=Math.floor(canvas.width/fontSize);drops=[];
  for(var i=0;i<cols;i++)drops[i]=Math.random()*canvas.height/fontSize|0;
 }
 function draw(){
  if(!canvas||!ctx)return;
  ctx.fillStyle='rgba(0,0,0,0.05)';ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle='#00ff41';ctx.font=fontSize+'px monospace';
  for(var i=0;i<drops.length;i++){
   var ch=charPool[Math.floor(Math.random()*charPool.length)];
   var x=i*fontSize;var y=drops[i]*fontSize;
   ctx.globalAlpha=0.6+Math.random()*0.4;
   ctx.fillText(ch,x,y);
   if(y>canvas.height&&Math.random()>0.975)drops[i]=0;
   drops[i]++;
  }
  ctx.globalAlpha=1;
  animId=requestAnimationFrame(draw);
 }
 function start(){
  active=true;createCanvas();draw();
  matrixBtn.style.background='#00ff41';matrixBtn.style.color='#000';matrixBtn.style.borderRadius='6px';
  try{localStorage.setItem(STORAGE_KEY,'1');}catch(e){}
 }
 function stop(){
  active=false;if(animId)cancelAnimationFrame(animId);animId=null;
  if(canvas){canvas.remove();canvas=null;ctx=null;}
  matrixBtn.style.background='';matrixBtn.style.color='';matrixBtn.style.borderRadius='';
  try{localStorage.removeItem(STORAGE_KEY);}catch(e){}
 }
 matrixBtn.onclick=function(){if(active)stop();else start();};
 window.addEventListener('resize',function(){if(active)resize();});
 try{if(localStorage.getItem(STORAGE_KEY)==='1')start();}catch(e){}
}

/* === APP RATING SYSTEM === */
function initRating(){
 if(document.getElementById('appRatingWrap'))return;
 var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
 var appPath=location.pathname.replace(/\/index\.html$/,'').replace(/\/$/,'');
 var STORAGE_KEY='appRating_'+appPath;
 var INDEX_KEY='ratingsIndex';
 var wrap=document.createElement('div');wrap.id='appRatingWrap';
 wrap.style.cssText='display:flex;align-items:center;gap:8px;margin:4px 0;flex-wrap:wrap;';
 var starsWrap=document.createElement('span');starsWrap.style.cssText='display:inline-flex;gap:2px;cursor:pointer;';
 var msgSpan=document.createElement('span');msgSpan.style.cssText='font-size:0.75rem;color:var(--accent,#c8aa64);opacity:0.8;';
 var currentRating=0;
 try{currentRating=parseInt(localStorage.getItem(STORAGE_KEY))||0;}catch(e){}
 var stars=[];
 for(var i=1;i<=5;i++){
  (function(idx){
   var star=document.createElement('span');
   star.textContent=idx<=currentRating?'\u2605':'\u2606';
   star.style.cssText='font-size:1.2rem;color:'+(idx<=currentRating?'#ffd700':'#888')+';transition:color 0.2s;user-select:none;';
   star.onmouseenter=function(){for(var j=0;j<5;j++){stars[j].style.color=j<idx?'#ffd700':'#888';stars[j].textContent=j<idx?'\u2605':'\u2606';}};
   star.onclick=function(){
    currentRating=idx;
    try{localStorage.setItem(STORAGE_KEY,String(idx));
     var index={};try{index=JSON.parse(localStorage.getItem(INDEX_KEY)||'{}');}catch(e){}
     index[appPath]=idx;localStorage.setItem(INDEX_KEY,JSON.stringify(index));
    }catch(e){}
    for(var j=0;j<5;j++){stars[j].style.color=j<idx?'#ffd700':'#888';stars[j].textContent=j<idx?'\u2605':'\u2606';}
    msgSpan.textContent=(L.ratingYours||'You rated')+': '+idx+'/5';
   };
   stars.push(star);starsWrap.appendChild(star);
  })(i);
 }
 starsWrap.onmouseleave=function(){for(var j=0;j<5;j++){stars[j].style.color=j<currentRating?'#ffd700':'#888';stars[j].textContent=j<currentRating?'\u2605':'\u2606';}};
 wrap.appendChild(starsWrap);
 if(currentRating>0)msgSpan.textContent=(L.ratingYours||'You rated')+': '+currentRating+'/5';
 wrap.appendChild(msgSpan);
 var titleEl=document.querySelector('.main-title')||document.querySelector('h1')||document.querySelector('.app-title');
 if(titleEl&&titleEl.parentNode)titleEl.parentNode.insertBefore(wrap,titleEl.nextSibling);
 else{wrap.style.cssText+='position:fixed;top:3rem;left:1rem;z-index:9999;';document.body.appendChild(wrap);}
}
document.addEventListener('DOMContentLoaded',function(){try{initMatrixRain();}catch(e){console.warn('Matrix init:',e);}try{initRating();}catch(e){console.warn('Rating init:',e);}});



/* === FLASHCARD SYSTEM === */
function initFlashcards(){
 if(document.getElementById('flashcardsBtn'))return;
 var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
 if(!L.flashTitle)return;
 var appDir=location.pathname.split('/').filter(Boolean).slice(-2,-1)[0]||'app';
 var storageKey='flash_score_'+appDir;
 var cards=[];
 for(var i=1;i<=5;i++){
  var t=L['flash_t'+i];var d=L['flash_d'+i];
  if(t&&d)cards.push({term:t,def:d});
 }
 if(cards.length===0)return;
 var btn=document.createElement('button');
 btn.id='flashcardsBtn';
 btn.className='btn-icon-only';
 btn.textContent='\ud83c\udccf';
 btn.title=L.flashTitle||'Flashcards';
 btn.style.cssText='cursor:pointer;font-size:1.1rem;';
 btn.onclick=function(){
  var deck=cards.slice();
  var known=0;
  var total=deck.length;
  var touchStartX=0;
  var ov=document.createElement('div');
  ov.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,0.92);z-index:99999;display:flex;align-items:center;justify-content:center;overflow:hidden;padding:20px;box-sizing:border-box;';
  var box=document.createElement('div');
  box.style.cssText='max-width:420px;width:95%;text-align:center;color:var(--text,#e4ddd0);';
  var h3=document.createElement('h3');
  h3.style.cssText='color:var(--accent,#d4a03c);margin-bottom:0.8rem;font-family:Orbitron,monospace;';
  h3.textContent=L.flashTitle;
  box.appendChild(h3);
  var progBar=document.createElement('div');
  progBar.style.cssText='background:rgba(255,255,255,0.1);border-radius:8px;height:8px;margin-bottom:1rem;overflow:hidden;';
  var progFill=document.createElement('div');
  progFill.style.cssText='height:100%;background:var(--accent,#d4a03c);border-radius:8px;transition:width 0.3s;width:0%;';
  progBar.appendChild(progFill);
  box.appendChild(progBar);
  var progText=document.createElement('div');
  progText.style.cssText='font-size:0.85rem;opacity:0.7;margin-bottom:1rem;';
  box.appendChild(progText);
  var cardWrap=document.createElement('div');
  cardWrap.style.cssText='perspective:800px;margin-bottom:1.2rem;';
  var card=document.createElement('div');
  card.style.cssText='width:100%;min-height:200px;position:relative;transform-style:preserve-3d;transition:transform 0.5s;cursor:pointer;';
  var front=document.createElement('div');
  front.style.cssText='position:absolute;inset:0;backface-visibility:hidden;background:var(--panel,#1a1a2e);border:2px solid var(--accent,#d4a03c);border-radius:14px;display:flex;align-items:center;justify-content:center;padding:1.5rem;font-size:1.3rem;font-weight:700;color:var(--accent,#d4a03c);font-family:Orbitron,monospace;min-height:200px;box-sizing:border-box;';
  var back=document.createElement('div');
  back.style.cssText='position:absolute;inset:0;backface-visibility:hidden;background:var(--panel,#1a1a2e);border:2px solid var(--accent,#d4a03c);border-radius:14px;display:flex;align-items:center;justify-content:center;padding:1.5rem;font-size:1rem;color:var(--text,#e4ddd0);transform:rotateY(180deg);min-height:200px;box-sizing:border-box;line-height:1.5;';
  card.appendChild(front);card.appendChild(back);
  cardWrap.appendChild(card);box.appendChild(cardWrap);
  var flipped=false;
  card.onclick=function(){flipped=!flipped;card.style.transform=flipped?'rotateY(180deg)':'rotateY(0)';};
  cardWrap.addEventListener('touchstart',function(e){touchStartX=e.touches[0].clientX;},{passive:true});
  cardWrap.addEventListener('touchend',function(e){
   var dx=e.changedTouches[0].clientX-touchStartX;
   if(Math.abs(dx)>50){if(dx>0)doKnow();else doReview();}
  });
  var btns=document.createElement('div');
  btns.style.cssText='display:flex;gap:1rem;justify-content:center;';
  var reviewBtn=document.createElement('button');
  reviewBtn.style.cssText='background:#c0392b;color:#fff;border:none;padding:10px 24px;border-radius:8px;cursor:pointer;font-weight:700;font-size:0.95rem;';
  reviewBtn.textContent='\u2717 '+(L.flashReview||'Review later');
  var knowBtn=document.createElement('button');
  knowBtn.style.cssText='background:#27ae60;color:#fff;border:none;padding:10px 24px;border-radius:8px;cursor:pointer;font-weight:700;font-size:0.95rem;';
  knowBtn.textContent='\u2713 '+(L.flashKnow||'Know it');
  btns.appendChild(reviewBtn);btns.appendChild(knowBtn);
  box.appendChild(btns);
  ov.appendChild(box);
  ov.onclick=function(e){if(e.target===ov)ov.remove();};
  document.body.appendChild(ov);
  function updateCard(){
   if(deck.length===0){
    front.textContent='\ud83c\udf89';
    back.textContent=L.flashDone||'All cards reviewed!';
    progFill.style.width='100%';
    progText.textContent=(L.flashProgress||'{0} of {1} remaining').replace('{0}','0').replace('{1}',String(total));
    try{localStorage.setItem(storageKey,JSON.stringify({known:known,total:total,date:new Date().toISOString()}));}catch(e){}
    reviewBtn.style.display='none';knowBtn.style.display='none';
    return;
   }
   flipped=false;card.style.transform='rotateY(0)';
   front.textContent=deck[0].term;
   back.textContent=deck[0].def;
   var pct=Math.round((1-deck.length/total)*100);
   progFill.style.width=pct+'%';
   progText.textContent=(L.flashProgress||'{0} of {1} remaining').replace('{0}',String(deck.length)).replace('{1}',String(total));
  }
  function doKnow(){if(deck.length>0){deck.shift();known++;updateCard();}}
  function doReview(){if(deck.length>0){var c=deck.shift();deck.push(c);updateCard();}}
  knowBtn.onclick=function(e){e.stopPropagation();doKnow();};
  reviewBtn.onclick=function(e){e.stopPropagation();doReview();};
  updateCard();
 };
 var hdr=document.querySelector('.header-buttons')||document.querySelector('.top-buttons')||document.querySelector('header');
 if(hdr)hdr.appendChild(btn);
 else{btn.style.cssText+='position:fixed;top:0.5rem;right:8rem;z-index:9999;';document.body.appendChild(btn);}
}
document.addEventListener('DOMContentLoaded',function(){try{initFlashcards();}catch(e){console.warn('Flashcards init:',e);}});

/* === PROGRESS CERTIFICATE === */
function initCertificate(){
 if(document.getElementById('certBtn'))return;
 var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
 if(!L.certTitle)return;
 var pathParts=location.pathname.split('/').filter(Boolean);
 var catDir='';var appDir='';
 for(var p=0;p<pathParts.length-1;p++){
  if(/^\d{2}-/.test(pathParts[p])){catDir=pathParts[p];appDir=pathParts[p+1]||'';break;}
 }
 if(!catDir)return;
 var catKey='cert_cat_'+catDir;
 var visited={};
 try{visited=JSON.parse(localStorage.getItem(catKey)||'{}');}catch(e){}
 if(appDir){visited[appDir]=Date.now();try{localStorage.setItem(catKey,JSON.stringify(visited));}catch(e){}}
 var siblingApps=[];
 try{
  var scripts=document.querySelectorAll('script[src]');
  scripts.forEach(function(s){
   var src=s.getAttribute('src')||'';
   if(src.indexOf('catalog')>-1||src.indexOf('index')>-1){
    var m=src.match(/(\d{2}-[^/]+)/);
    if(m)catDir=m[1];
   }
  });
 }catch(e){}
 var catName=catDir.replace(/^\d{2}-/,'').replace(/-/g,' ').replace(/\b\w/g,function(c){return c.toUpperCase();});
 var btn=document.createElement('button');
 btn.id='certBtn';
 btn.className='btn-icon-only';
 btn.textContent='\ud83c\udfc6';
 btn.title=L.certTitle||'Certificate';
 btn.style.cssText='cursor:pointer;font-size:1.1rem;';
 btn.onclick=function(){
  var visitedCount=Object.keys(visited).length;
  var totalApps=Math.max(visitedCount,3);
  var allDone=visitedCount>=totalApps&&visitedCount>1;
  var ov=document.createElement('div');
  ov.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,0.92);z-index:99999;display:flex;align-items:center;justify-content:center;overflow-y:auto;padding:20px;box-sizing:border-box;';
  var box=document.createElement('div');
  box.style.cssText='background:var(--panel,#0b0d24);border:2px solid var(--accent,#d4a03c);border-radius:14px;padding:2rem;max-width:660px;width:95%;text-align:center;color:var(--text,#e4ddd0);';
  var h3=document.createElement('h3');
  h3.style.cssText='color:var(--accent,#d4a03c);margin-bottom:1rem;font-family:Orbitron,monospace;';
  h3.textContent=L.certTitle;
  box.appendChild(h3);
  var progWrap=document.createElement('div');
  progWrap.style.cssText='margin-bottom:1rem;';
  var progBar=document.createElement('div');
  progBar.style.cssText='background:rgba(255,255,255,0.1);border-radius:8px;height:10px;overflow:hidden;margin-bottom:0.5rem;';
  var progFill=document.createElement('div');
  var pct=totalApps>0?Math.min(100,Math.round(visitedCount/totalApps*100)):0;
  progFill.style.cssText='height:100%;background:var(--accent,#d4a03c);border-radius:8px;transition:width 0.5s;width:'+pct+'%;';
  progBar.appendChild(progFill);
  progWrap.appendChild(progBar);
  var progLabel=document.createElement('div');
  progLabel.style.cssText='font-size:0.9rem;opacity:0.8;';
  progLabel.textContent=(L.certProgress||'{0} of {1} apps completed').replace('{0}',String(visitedCount)).replace('{1}',String(totalApps));
  progWrap.appendChild(progLabel);
  box.appendChild(progWrap);
  if(allDone){
   var canvas=document.createElement('canvas');
   canvas.width=600;canvas.height=400;
   canvas.style.cssText='width:100%;max-width:600px;border-radius:8px;margin:1rem 0;';
   box.appendChild(canvas);
   var ctx=canvas.getContext('2d');
   ctx.fillStyle='#0b0d24';ctx.fillRect(0,0,600,400);
   ctx.strokeStyle='#d4a03c';ctx.lineWidth=6;
   ctx.strokeRect(10,10,580,380);
   ctx.strokeStyle='#b8941f';ctx.lineWidth=2;
   ctx.strokeRect(18,18,564,364);
   ctx.fillStyle='#d4a03c';ctx.font='bold 22px Orbitron,monospace';
   var certText=L.certTitle||'CERTIFICATE OF COMPLETION';
   ctx.fillText(certText,(600-ctx.measureText(certText).width)/2,70);
   ctx.strokeStyle='#d4a03c';ctx.lineWidth=1;
   ctx.beginPath();ctx.moveTo(100,85);ctx.lineTo(500,85);ctx.stroke();
   ctx.fillStyle='#e4ddd0';ctx.font='16px Tajawal,sans-serif';
   var compText=L.certComplete||'Congratulations! All apps completed!';
   ctx.fillText(compText,(600-ctx.measureText(compText).width)/2,130);
   ctx.fillStyle='#d4a03c';ctx.font='bold 20px Orbitron,monospace';
   ctx.fillText(catName,(600-ctx.measureText(catName).width)/2,180);
   ctx.fillStyle='#e4ddd0';ctx.font='14px Tajawal,sans-serif';
   var dateStr=new Date().toLocaleDateString();
   ctx.fillText(dateStr,(600-ctx.measureText(dateStr).width)/2,220);
   var ranks=['Recruit','Field Agent','Special Agent','Senior Operative','Shadow Commander','Ghost Director'];
   var rank=ranks[Math.min(ranks.length-1,Math.floor(visitedCount/3))];
   ctx.fillStyle='#ffd700';ctx.font='bold 18px Orbitron,monospace';
   ctx.fillText(rank,(600-ctx.measureText(rank).width)/2,260);
   ctx.beginPath();ctx.arc(300,330,35,0,Math.PI*2);
   ctx.fillStyle='rgba(212,160,60,0.15)';ctx.fill();
   ctx.strokeStyle='#d4a03c';ctx.lineWidth=3;ctx.stroke();
   ctx.beginPath();ctx.arc(300,330,28,0,Math.PI*2);
   ctx.strokeStyle='#b8941f';ctx.lineWidth=1.5;ctx.stroke();
   ctx.fillStyle='#d4a03c';ctx.font='bold 20px serif';
   ctx.fillText('\u2605',292,337);
   ctx.fillStyle='rgba(212,160,60,0.08)';ctx.font='10px monospace';
   var certName=L.certName||'Workshop DIY';
   ctx.fillStyle='#888';ctx.font='11px Tajawal,sans-serif';
   ctx.fillText(certName,(600-ctx.measureText(certName).width)/2,390);
   var dlBtn=document.createElement('button');
   dlBtn.textContent=L.certDownload||'Download Certificate';
   dlBtn.style.cssText='margin-top:1rem;background:var(--accent,#d4a03c);color:#000;border:none;padding:10px 24px;border-radius:8px;cursor:pointer;font-weight:700;font-size:0.95rem;';
   dlBtn.onclick=function(){
    var link=document.createElement('a');
    link.download='certificate-'+catDir+'.png';
    link.href=canvas.toDataURL('image/png');
    link.click();
   };
   box.appendChild(dlBtn);
  }else{
   var lockMsg=document.createElement('div');
   lockMsg.style.cssText='font-size:2.5rem;margin:1rem 0;';
   lockMsg.textContent='\ud83d\udd12';
   box.appendChild(lockMsg);
   var hint=document.createElement('div');
   hint.style.cssText='opacity:0.6;font-size:0.9rem;';
   hint.textContent='Visit all apps in this category to unlock the certificate.';
   box.appendChild(hint);
  }
  var appList=document.createElement('div');
  appList.style.cssText='margin-top:1rem;text-align:left;max-height:150px;overflow-y:auto;padding:0.5rem;background:rgba(0,0,0,0.3);border-radius:8px;font-size:0.8rem;';
  Object.keys(visited).sort().forEach(function(a){
   var row=document.createElement('div');
   row.style.cssText='padding:2px 4px;opacity:0.7;';
   row.textContent='\u2713 '+a;
   appList.appendChild(row);
  });
  if(Object.keys(visited).length>0)box.appendChild(appList);
  ov.appendChild(box);
  ov.onclick=function(e){if(e.target===ov)ov.remove();};
  document.body.appendChild(ov);
 };
 var hdr=document.querySelector('.header-buttons')||document.querySelector('.top-buttons')||document.querySelector('header');
 if(hdr)hdr.appendChild(btn);
 else{btn.style.cssText+='position:fixed;top:0.5rem;right:9.5rem;z-index:9999;';document.body.appendChild(btn);}
}
document.addEventListener('DOMContentLoaded',function(){try{initCertificate();}catch(e){console.warn('Certificate init:',e);}});



/* === ANNOTATION MODE === */
function initAnnotation(){
 if(document.getElementById('annotBtn'))return;
 var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
 var annotBtn=document.createElement('button');annotBtn.id='annotBtn';annotBtn.className='btn-icon-only';
 annotBtn.textContent='\u270F\uFE0F';annotBtn.title=L.annotTitle||'Annotation Mode';annotBtn.style.cssText='cursor:pointer;font-size:1rem;';
 var hdr=document.querySelector('.header-buttons')||document.querySelector('.top-buttons')||document.querySelector('header');
 if(hdr)hdr.appendChild(annotBtn);else{annotBtn.style.cssText+='position:fixed;top:0.5rem;right:8rem;z-index:9999;';document.body.appendChild(annotBtn);}
 var annotActive=false;var overlay=null;var toolbar=null;var ctx=null;
 var currentTool='pen';var currentColor='#ff0000';var currentWidth=3;
 var undoStack=[];var isDrawing=false;var startX=0;var startY=0;
 var colors=['#ff0000','#ffff00','#00cc00','#3399ff','#ffffff'];
 var appKey='annot_'+window.location.pathname;
 function createOverlay(){
  var simC=document.getElementById('simCanvas');
  if(!simC)return null;
  var rect=simC.getBoundingClientRect();
  var c=document.createElement('canvas');c.id='annotOverlay';
  c.width=simC.width;c.height=simC.height;
  c.style.cssText='position:absolute;top:'+rect.top+'px;left:'+rect.left+'px;width:'+rect.width+'px;height:'+rect.height+'px;z-index:9990;cursor:crosshair;';
  document.body.appendChild(c);
  var saved=sessionStorage.getItem(appKey);
  if(saved){var img=new Image();img.onload=function(){c.getContext('2d').drawImage(img,0,0);};img.src=saved;}
  return c;
 }
 function saveState(){
  if(overlay)undoStack.push(overlay.toDataURL());
  if(undoStack.length>30)undoStack.shift();
 }
 function persistSession(){if(overlay)sessionStorage.setItem(appKey,overlay.toDataURL());}
 function createToolbar(){
  var tb=document.createElement('div');tb.id='annotToolbar';
  tb.style.cssText='position:fixed;top:60px;right:10px;background:var(--panel,#0b0d24);border:2px solid var(--accent,#d4a03c);border-radius:12px;padding:10px;z-index:9995;display:flex;flex-direction:column;gap:6px;align-items:center;font-size:0.75rem;color:var(--text,#e4ddd0);';
  var tools=[{id:'pen',label:L.annotDraw||'Freehand',icon:'\u270D\uFE0F'},{id:'arrow',label:L.annotArrow||'Arrow',icon:'\u2197\uFE0F'},{id:'circle',label:L.annotCircle||'Circle',icon:'\u2B55'},{id:'text',label:L.annotText||'Text',icon:'\uD83C\uDD70\uFE0F'}];
  tools.forEach(function(t){
   var b=document.createElement('button');b.textContent=t.icon;b.title=t.label;b.dataset.tool=t.id;
   b.style.cssText='background:'+(currentTool===t.id?'var(--accent,#d4a03c)':'transparent')+';color:'+(currentTool===t.id?'#000':'var(--text,#e4ddd0)')+';border:1px solid var(--accent,#d4a03c);padding:4px 8px;border-radius:6px;cursor:pointer;font-size:1rem;width:36px;height:36px;';
   b.onclick=function(){currentTool=t.id;updateToolbar();};
   tb.appendChild(b);
  });
  var colorRow=document.createElement('div');colorRow.style.cssText='display:flex;gap:3px;margin:4px 0;';
  colors.forEach(function(c){
   var cb=document.createElement('div');
   cb.style.cssText='width:20px;height:20px;border-radius:50%;cursor:pointer;border:2px solid '+(currentColor===c?'var(--accent,#d4a03c)':'transparent')+';background:'+c+';';
   cb.dataset.color=c;cb.onclick=function(){currentColor=c;updateToolbar();};
   colorRow.appendChild(cb);
  });
  tb.appendChild(colorRow);
  var widthRow=document.createElement('div');widthRow.style.cssText='display:flex;gap:4px;';
  [{w:2,label:'thin'},{w:4,label:'med'},{w:8,label:'thick'}].forEach(function(s){
   var wb=document.createElement('button');wb.textContent=s.label;
   wb.style.cssText='background:'+(currentWidth===s.w?'var(--accent,#d4a03c)':'transparent')+';color:'+(currentWidth===s.w?'#000':'var(--text,#e4ddd0)')+';border:1px solid var(--accent,#d4a03c);padding:2px 6px;border-radius:4px;cursor:pointer;font-size:0.65rem;';
   wb.onclick=function(){currentWidth=s.w;updateToolbar();};
   tb.appendChild(wb);
  });
  tb.appendChild(widthRow);
  var actions=[
   {label:L.annotUndo||'Undo',icon:'\u21A9\uFE0F',fn:function(){if(undoStack.length>0){var d=undoStack.pop();var img=new Image();img.onload=function(){ctx.clearRect(0,0,overlay.width,overlay.height);ctx.drawImage(img,0,0);persistSession();};img.src=d;}else{ctx.clearRect(0,0,overlay.width,overlay.height);persistSession();}}},
   {label:L.annotClear||'Clear All',icon:'\uD83D\uDDD1\uFE0F',fn:function(){saveState();ctx.clearRect(0,0,overlay.width,overlay.height);persistSession();}},
   {label:L.annotSave||'Save as PNG',icon:'\uD83D\uDCBE',fn:function(){
    var simC=document.getElementById('simCanvas');if(!simC)return;
    var merged=document.createElement('canvas');merged.width=simC.width;merged.height=simC.height;
    var mCtx=merged.getContext('2d');mCtx.drawImage(simC,0,0);if(overlay)mCtx.drawImage(overlay,0,0);
    var link=document.createElement('a');link.download='annotated-simulation.png';link.href=merged.toDataURL();link.click();
   }},
   {label:L.annotExit||'Exit Annotation',icon:'\u274C',fn:function(){annotBtn.click();}}
  ];
  actions.forEach(function(a){
   var ab=document.createElement('button');ab.textContent=a.icon+' '+a.label;
   ab.style.cssText='background:transparent;color:var(--text,#e4ddd0);border:1px solid var(--accent,#d4a03c);padding:4px 8px;border-radius:6px;cursor:pointer;font-size:0.7rem;width:100%;text-align:left;';
   ab.onclick=a.fn;tb.appendChild(ab);
  });
  document.body.appendChild(tb);return tb;
 }
 function updateToolbar(){
  if(!toolbar)return;
  toolbar.querySelectorAll('[data-tool]').forEach(function(b){
   b.style.background=b.dataset.tool===currentTool?'var(--accent,#d4a03c)':'transparent';
   b.style.color=b.dataset.tool===currentTool?'#000':'var(--text,#e4ddd0)';
  });
  toolbar.querySelectorAll('[data-color]').forEach(function(b){
   b.style.borderColor=b.dataset.color===currentColor?'var(--accent,#d4a03c)':'transparent';
  });
 }
 function getPos(e){
  var r=overlay.getBoundingClientRect();
  var scaleX=overlay.width/r.width;var scaleY=overlay.height/r.height;
  return{x:(e.clientX-r.left)*scaleX,y:(e.clientY-r.top)*scaleY};
 }
 function onDown(e){
  e.preventDefault();isDrawing=true;saveState();
  var p=getPos(e.touches?e.touches[0]:e);startX=p.x;startY=p.y;
  if(currentTool==='pen'){ctx.beginPath();ctx.moveTo(p.x,p.y);}
  if(currentTool==='text'){var txt=prompt('Text:');if(txt){ctx.font='bold '+Math.max(14,currentWidth*4)+'px sans-serif';ctx.fillStyle=currentColor;ctx.fillText(txt,p.x,p.y);persistSession();}isDrawing=false;}
 }
 function onMove(e){
  if(!isDrawing)return;e.preventDefault();
  var p=getPos(e.touches?e.touches[0]:e);
  if(currentTool==='pen'){ctx.strokeStyle=currentColor;ctx.lineWidth=currentWidth;ctx.lineCap='round';ctx.lineJoin='round';ctx.lineTo(p.x,p.y);ctx.stroke();}
 }
 function onUp(e){
  if(!isDrawing)return;isDrawing=false;
  var p=getPos(e.changedTouches?e.changedTouches[0]:e);
  if(currentTool==='arrow'){
   ctx.strokeStyle=currentColor;ctx.lineWidth=currentWidth;ctx.lineCap='round';
   ctx.beginPath();ctx.moveTo(startX,startY);ctx.lineTo(p.x,p.y);ctx.stroke();
   var angle=Math.atan2(p.y-startY,p.x-startX);var hl=12+currentWidth*2;
   ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x-hl*Math.cos(angle-0.4),p.y-hl*Math.sin(angle-0.4));ctx.stroke();
   ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x-hl*Math.cos(angle+0.4),p.y-hl*Math.sin(angle+0.4));ctx.stroke();
  }
  if(currentTool==='circle'){
   var dx=p.x-startX;var dy=p.y-startY;var rad=Math.sqrt(dx*dx+dy*dy);
   ctx.strokeStyle=currentColor;ctx.lineWidth=currentWidth;
   ctx.beginPath();ctx.arc(startX,startY,rad,0,Math.PI*2);ctx.stroke();
  }
  persistSession();
 }
 annotBtn.onclick=function(){
  annotActive=!annotActive;
  if(annotActive){
   annotBtn.style.background='var(--accent,#d4a03c)';annotBtn.style.color='#000';annotBtn.style.borderRadius='8px';
   overlay=createOverlay();
   if(overlay){ctx=overlay.getContext('2d');
    overlay.addEventListener('mousedown',onDown);overlay.addEventListener('mousemove',onMove);overlay.addEventListener('mouseup',onUp);
    overlay.addEventListener('touchstart',onDown,{passive:false});overlay.addEventListener('touchmove',onMove,{passive:false});overlay.addEventListener('touchend',onUp);
   }
   toolbar=createToolbar();
  }else{
   annotBtn.style.background='';annotBtn.style.color='';annotBtn.style.borderRadius='';
   if(overlay){overlay.remove();overlay=null;ctx=null;}
   if(toolbar){toolbar.remove();toolbar=null;}
  }
 };
}

/* === BOOKMARK COLLECTIONS === */
function initBookmarks(){
 if(document.getElementById('bmkBtn'))return;
 var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
 var STORAGE_KEY='ops_bookmarks';
 var appPath=window.location.pathname;
 function loadData(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY))||{collections:{'default':[]}};}catch(e){return{collections:{'default':[]}};}};
 function saveData(d){localStorage.setItem(STORAGE_KEY,JSON.stringify(d));}
 function isBookmarked(){var d=loadData();for(var c in d.collections){if(d.collections[c].indexOf(appPath)!==-1)return true;}return false;}
 function countAll(){var d=loadData();var n=0;var seen={};for(var c in d.collections){d.collections[c].forEach(function(p){if(!seen[p]){seen[p]=1;n++;}});}return n;}
 var bmkBtn=document.createElement('button');bmkBtn.id='bmkBtn';bmkBtn.className='btn-icon-only';
 bmkBtn.style.cssText='cursor:pointer;font-size:1rem;position:relative;';
 var badge=document.createElement('span');badge.id='bmkBadge';
 badge.style.cssText='position:absolute;top:-4px;right:-4px;background:#d4a03c;color:#000;font-size:0.55rem;font-weight:700;border-radius:50%;width:16px;height:16px;display:flex;align-items:center;justify-content:center;pointer-events:none;';
 bmkBtn.appendChild(badge);
 function updateBtn(){
  var bm=isBookmarked();bmkBtn.textContent=bm?'\u2B50':'\u2606';bmkBtn.title=bm?(L.bookmarkRemove||'Remove'):(L.bookmarkAdd||'Add Bookmark');
  bmkBtn.appendChild(badge);var cnt=countAll();badge.textContent=cnt>0?cnt:'';badge.style.display=cnt>0?'flex':'none';
 }
 updateBtn();
 var hdr=document.querySelector('.header-buttons')||document.querySelector('.top-buttons')||document.querySelector('header');
 if(hdr)hdr.appendChild(bmkBtn);else{bmkBtn.style.cssText+='position:fixed;top:0.5rem;right:10rem;z-index:9999;';document.body.appendChild(bmkBtn);}
 var panel=null;var pressTimer=null;
 function toggleBookmark(){
  var d=loadData();
  if(isBookmarked()){for(var c in d.collections){var idx=d.collections[c].indexOf(appPath);if(idx!==-1)d.collections[c].splice(idx,1);}
  }else{if(!d.collections['default'])d.collections['default']=[];d.collections['default'].push(appPath);}
  saveData(d);updateBtn();
 }
 function openManager(){
  if(panel){panel.remove();panel=null;return;}
  var d=loadData();
  panel=document.createElement('div');panel.id='bmkPanel';
  panel.style.cssText='position:fixed;top:50px;right:10px;background:var(--panel,#0b0d24);border:2px solid var(--accent,#d4a03c);border-radius:12px;padding:14px;z-index:9998;width:280px;max-height:70vh;overflow-y:auto;color:var(--text,#e4ddd0);font-size:0.8rem;';
  var header=document.createElement('h3');header.textContent=L.bookmarkTitle||'My Bookmarks';
  header.style.cssText='color:var(--accent,#d4a03c);font-family:Orbitron,monospace;font-size:0.9rem;margin:0 0 10px 0;';
  panel.appendChild(header);
  var allPaths={};for(var c in d.collections){d.collections[c].forEach(function(p){if(!allPaths[p])allPaths[p]=[];allPaths[p].push(c);});}
  var paths=Object.keys(allPaths);
  if(paths.length===0){var empty=document.createElement('p');empty.textContent=L.bookmarkEmpty||'No bookmarks yet';empty.style.cssText='opacity:0.5;font-style:italic;';panel.appendChild(empty);}
  else{paths.forEach(function(p){
   var row=document.createElement('div');row.style.cssText='display:flex;align-items:center;gap:6px;margin:4px 0;padding:4px;border-radius:6px;background:rgba(255,255,255,0.05);';
   var link=document.createElement('a');link.href=p;link.textContent=p.split('/').filter(Boolean).pop()||p;
   link.style.cssText='color:var(--accent,#d4a03c);text-decoration:none;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:0.75rem;';
   row.appendChild(link);
   var colSel=document.createElement('select');colSel.style.cssText='background:var(--panel,#0b0d24);color:var(--text,#e4ddd0);border:1px solid var(--accent,#d4a03c);border-radius:4px;font-size:0.65rem;padding:1px 4px;';
   for(var cn in d.collections){var opt=document.createElement('option');opt.value=cn;opt.textContent=cn;if(allPaths[p].indexOf(cn)!==-1)opt.selected=true;colSel.appendChild(opt);}
   colSel.onchange=function(){var nd=loadData();for(var cc in nd.collections){var ii=nd.collections[cc].indexOf(p);if(ii!==-1)nd.collections[cc].splice(ii,1);}if(!nd.collections[colSel.value])nd.collections[colSel.value]=[];nd.collections[colSel.value].push(p);saveData(nd);updateBtn();openManager();openManager();};
   row.appendChild(colSel);
   var rmBtn=document.createElement('button');rmBtn.textContent='\u274C';rmBtn.title=L.bookmarkRemove||'Remove';
   rmBtn.style.cssText='background:transparent;border:none;color:#ff4444;cursor:pointer;font-size:0.8rem;padding:2px;';
   rmBtn.onclick=function(){var nd=loadData();for(var cc in nd.collections){var ii=nd.collections[cc].indexOf(p);if(ii!==-1)nd.collections[cc].splice(ii,1);}saveData(nd);updateBtn();openManager();openManager();};
   row.appendChild(rmBtn);
   panel.appendChild(row);
  });}
  var divider=document.createElement('hr');divider.style.cssText='border:none;border-top:1px solid var(--accent,#d4a03c);margin:10px 0;opacity:0.3;';
  panel.appendChild(divider);
  var newRow=document.createElement('div');newRow.style.cssText='display:flex;gap:4px;';
  var newInput=document.createElement('input');newInput.placeholder=L.bookmarkNew||'New Collection';
  newInput.style.cssText='flex:1;background:var(--panel,#0b0d24);color:var(--text,#e4ddd0);border:1px solid var(--accent,#d4a03c);border-radius:6px;padding:4px 8px;font-size:0.75rem;';
  var newBtn=document.createElement('button');newBtn.textContent='+';
  newBtn.style.cssText='background:var(--accent,#d4a03c);color:#000;border:none;padding:4px 10px;border-radius:6px;cursor:pointer;font-weight:700;';
  newBtn.onclick=function(){var name=newInput.value.trim();if(name){var nd=loadData();if(!nd.collections[name])nd.collections[name]=[];saveData(nd);openManager();openManager();}};
  newRow.appendChild(newInput);newRow.appendChild(newBtn);panel.appendChild(newRow);
  document.body.appendChild(panel);
 }
 bmkBtn.addEventListener('click',function(e){if(!pressTimer)toggleBookmark();pressTimer=null;});
 bmkBtn.addEventListener('mousedown',function(){pressTimer=setTimeout(function(){pressTimer='long';openManager();},500);});
 bmkBtn.addEventListener('mouseup',function(){if(pressTimer&&pressTimer!=='long')clearTimeout(pressTimer);});
 bmkBtn.addEventListener('mouseleave',function(){if(pressTimer&&pressTimer!=='long')clearTimeout(pressTimer);});
 bmkBtn.addEventListener('contextmenu',function(e){e.preventDefault();openManager();});
}
document.addEventListener('DOMContentLoaded',function(){try{initAnnotation();}catch(e){console.warn('Annotation init:',e);}try{initBookmarks();}catch(e){console.warn('Bookmarks init:',e);}});



/* === MORSE CODE EASTER EGG === */
function initMorseEasterEgg(){
 if(document.getElementById('morseHint'))return;
 var MORSE_MAP={'.-':'A','-...':'B','-.-.':'C','-..':'D','.':'E','..-.':'F','--.':'G','....':'H','..':'I','.---':'J','-.-':'K','.-..':'L','--':'M','-.':'N','---':'O','.--.':'P','--.-':'Q','.-.':'R','...':'S','-':'T','..-':'U','...-':'V','.--':'W','-..-':'X','-.--':'Y','--..':'Z'};
 var morseSeq=[];var morseTimer=null;var keyDownTime=0;
 var hint=document.createElement('span');hint.id='morseHint';hint.textContent='|';hint.title='Morse';hint.style.cssText='opacity:0.3;cursor:default;font-size:0.7rem;margin:0 4px;';
 var footer=document.querySelector('footer')||document.querySelector('.footer');
 if(footer)footer.appendChild(hint);
 function decodeMorse(){
  var letters=[];var current='';
  for(var i=0;i<morseSeq.length;i++){
   if(morseSeq[i]===' '){if(current){letters.push(MORSE_MAP[current]||'?');current='';}}
   else{current+=morseSeq[i];}
  }
  if(current)letters.push(MORSE_MAP[current]||'?');
  var word=letters.join('');
  var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
  if(word==='SOS'){
   var flash=document.createElement('div');flash.style.cssText='position:fixed;inset:0;background:white;z-index:999999;opacity:0.8;transition:opacity 0.5s;';
   document.body.appendChild(flash);setTimeout(function(){flash.style.opacity='0';setTimeout(function(){flash.remove();},500);},200);
   var ov=document.createElement('div');ov.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,0.9);z-index:99999;display:flex;align-items:center;justify-content:center;';
   var box=document.createElement('div');box.style.cssText='background:var(--panel,#0b0d24);border:2px solid var(--accent,#d4a03c);border-radius:14px;padding:2rem;max-width:420px;width:90%;color:var(--text,#e4ddd0);text-align:center;';
   box.innerHTML='<h3 style="color:var(--accent,#d4a03c);font-family:Orbitron,monospace;">'+((L.morseSecret)||'Morse Easter Egg')+'</h3><p style="margin:1rem 0;font-style:italic;line-height:1.6;">'+((L.morseBackstory)||'Origin unknown.')+'</p><button style="background:var(--accent,#d4a03c);color:#000;border:none;padding:8px 20px;border-radius:8px;cursor:pointer;font-weight:700;" onclick="this.parentElement.parentElement.remove();">OK</button>';
   ov.appendChild(box);ov.onclick=function(e){if(e.target===ov)ov.remove();};document.body.appendChild(ov);
  }else if(word==='HELP'){
   var helpBtn=document.querySelector('[data-panel="help"]')||document.querySelector('.btn-help')||document.querySelector('[title="Help"]');
   if(helpBtn)helpBtn.click();
  }
  if(word.length>0){console.log((L.morseDecoded||'Decoded: ')+word);}
  morseSeq=[];
 }
 document.addEventListener('keydown',function(e){
  if(e.code!=='Space'||e.repeat||e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA')return;
  e.preventDefault();keyDownTime=Date.now();if(morseTimer)clearTimeout(morseTimer);
 });
 document.addEventListener('keyup',function(e){
  if(e.code!=='Space'||e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA')return;
  var dur=Date.now()-keyDownTime;
  morseSeq.push(dur<200?'.':'-');
  if(morseTimer)clearTimeout(morseTimer);
  morseTimer=setTimeout(function(){morseSeq.push(' ');morseTimer=setTimeout(decodeMorse,1000);},300);
 });
}

/* === DNA FINGERPRINT VISUALIZER === */
function initDNAFingerprint(){
 if(document.getElementById('dnaBtn'))return;
 var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
 var dnaBtn=document.createElement('button');dnaBtn.id='dnaBtn';dnaBtn.className='btn-icon-only';
 dnaBtn.textContent='\uD83E\uDDEC';dnaBtn.title=L.dnaTitle||'DNA Fingerprint';dnaBtn.style.cssText='cursor:pointer;font-size:1rem;';
 var hdr=document.querySelector('.header-buttons')||document.querySelector('.top-buttons')||document.querySelector('header');
 if(hdr)hdr.appendChild(dnaBtn);else{dnaBtn.style.cssText+='position:fixed;top:0.5rem;right:6rem;z-index:9999;';document.body.appendChild(dnaBtn);}
 var panel=null;var canvas=null;var animId=null;
 function getSliderHues(){
  var sliders=document.querySelectorAll('input[type="range"]');var hues=[];
  sliders.forEach(function(s){var min=parseFloat(s.min)||0;var max=parseFloat(s.max)||100;var val=parseFloat(s.value);var ratio=(val-min)/(max-min||1);hues.push(Math.round(ratio*360));});
  if(hues.length===0)hues=[0,120,240];return hues;
 }
 function drawDNA(){
  if(!canvas)return;var ctx=canvas.getContext('2d');var w=canvas.width;var h=canvas.height;
  ctx.clearRect(0,0,w,h);var hues=getSliderHues();var t=Date.now()/1000;
  for(var x=0;x<w;x+=4){
   var phase=x/w*Math.PI*4+t;var y1=h/2+Math.sin(phase)*25;var y2=h/2+Math.sin(phase+Math.PI)*25;
   var hIdx=Math.floor((x/w)*hues.length)%hues.length;var hue=hues[hIdx]||0;
   ctx.beginPath();ctx.arc(x,y1,2,0,Math.PI*2);ctx.fillStyle='hsl('+hue+',80%,60%)';ctx.fill();
   ctx.beginPath();ctx.arc(x,y2,2,0,Math.PI*2);ctx.fillStyle='hsl('+(hue+180)%360+',80%,60%)';ctx.fill();
   if(x%12<4){ctx.beginPath();ctx.moveTo(x,y1);ctx.lineTo(x,y2);ctx.strokeStyle='hsla('+hue+',60%,50%,0.3)';ctx.lineWidth=1;ctx.stroke();}
  }
  animId=requestAnimationFrame(drawDNA);
 }
 dnaBtn.onclick=function(){
  if(panel){panel.remove();panel=null;if(animId)cancelAnimationFrame(animId);return;}
  panel=document.createElement('div');panel.style.cssText='position:fixed;bottom:80px;right:20px;background:var(--panel,#0b0d24);border:2px solid var(--accent,#d4a03c);border-radius:12px;padding:12px;z-index:9998;text-align:center;';
  panel.innerHTML='<div style="color:var(--accent,#d4a03c);font-family:Orbitron,monospace;font-size:0.8rem;margin-bottom:6px;">'+(L.dnaTitle||'DNA Fingerprint')+'</div>';
  canvas=document.createElement('canvas');canvas.width=200;canvas.height=80;canvas.style.cssText='border-radius:8px;background:rgba(0,0,0,0.3);display:block;';
  panel.appendChild(canvas);
  var saveBtn=document.createElement('button');saveBtn.textContent=L.dnaSave||'Save DNA';
  saveBtn.style.cssText='margin-top:8px;background:var(--accent,#d4a03c);color:#000;border:none;padding:4px 14px;border-radius:6px;cursor:pointer;font-size:0.75rem;font-weight:700;';
  saveBtn.onclick=function(){var link=document.createElement('a');link.download='dna-fingerprint.png';link.href=canvas.toDataURL();link.click();};
  panel.appendChild(saveBtn);
  var info=document.createElement('div');info.style.cssText='color:var(--text,#e4ddd0);font-size:0.65rem;opacity:0.7;margin-top:4px;';info.textContent=L.dnaInfo||'Unique visual signature';
  panel.appendChild(info);document.body.appendChild(panel);drawDNA();
 };
}

/* === SANDBOX MODE === */
function initSandboxMode(){
 if(document.getElementById('sandboxBtn'))return;
 var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
 var active=false;var originals=[];var customCount=0;
 var sandboxBtn=document.createElement('button');sandboxBtn.id='sandboxBtn';sandboxBtn.className='btn-icon-only';
 sandboxBtn.textContent='\uD83D\uDD27';sandboxBtn.title=L.sandboxTitle||'Sandbox Mode';sandboxBtn.style.cssText='cursor:pointer;font-size:1rem;';
 var hdr=document.querySelector('.header-buttons')||document.querySelector('.top-buttons')||document.querySelector('header');
 if(hdr)hdr.appendChild(sandboxBtn);else{sandboxBtn.style.cssText+='position:fixed;top:0.5rem;right:9rem;z-index:9999;';document.body.appendChild(sandboxBtn);}
 var controlPanel=null;
 function storeOriginals(){
  originals=[];document.querySelectorAll('input[type="range"]').forEach(function(s){
   originals.push({el:s,min:s.min,max:s.max,val:s.value,step:s.step});
  });
 }
 function unlockSliders(){
  document.querySelectorAll('input[type="range"]').forEach(function(s){s.min='0';s.max='100';});
 }
 function restoreSliders(){
  originals.forEach(function(o){o.el.min=o.min;o.el.max=o.max;o.el.value=o.val;o.el.step=o.step;o.el.dispatchEvent(new Event('input',{bubbles:true}));});
 }
 function addCustomSlider(){
  customCount++;
  var name=prompt('Parameter name:','Custom-'+customCount);if(!name)return;
  var wrap=document.createElement('div');wrap.className='sandbox-custom-slider';wrap.style.cssText='margin:8px 0;padding:6px;background:rgba(0,0,0,0.2);border-radius:8px;';
  var lbl=document.createElement('label');lbl.textContent=name;lbl.style.cssText='color:var(--accent,#d4a03c);font-size:0.75rem;display:block;';
  var sl=document.createElement('input');sl.type='range';sl.min='0';sl.max='100';sl.value='50';sl.style.cssText='width:100%;';
  var valSpan=document.createElement('span');valSpan.textContent='50';valSpan.style.cssText='color:var(--text,#e4ddd0);font-size:0.7rem;';
  sl.oninput=function(){valSpan.textContent=sl.value;console.log('[Sandbox] '+name+': '+sl.value);};
  wrap.appendChild(lbl);wrap.appendChild(sl);wrap.appendChild(valSpan);
  if(controlPanel)controlPanel.appendChild(wrap);
 }
 sandboxBtn.onclick=function(){
  active=!active;
  if(active){
   sandboxBtn.style.background='var(--accent,#d4a03c)';sandboxBtn.style.color='#000';sandboxBtn.style.borderRadius='6px';
   storeOriginals();unlockSliders();
   controlPanel=document.createElement('div');controlPanel.id='sandboxPanel';
   controlPanel.style.cssText='position:fixed;bottom:80px;left:20px;background:var(--panel,#0b0d24);border:2px solid var(--accent,#d4a03c);border-radius:12px;padding:12px;z-index:9998;min-width:200px;max-height:300px;overflow-y:auto;';
   controlPanel.innerHTML='<div style="color:var(--accent,#d4a03c);font-family:Orbitron,monospace;font-size:0.8rem;margin-bottom:8px;">'+(L.sandboxOn||'Sandbox ON')+'</div>';
   var addBtn=document.createElement('button');addBtn.textContent=L.sandboxAdd||'Add Parameter';
   addBtn.style.cssText='background:var(--accent,#d4a03c);color:#000;border:none;padding:4px 12px;border-radius:6px;cursor:pointer;font-size:0.7rem;font-weight:700;margin-right:6px;';
   addBtn.onclick=addCustomSlider;
   var resetBtn=document.createElement('button');resetBtn.textContent=L.sandboxReset||'Reset Defaults';
   resetBtn.style.cssText='background:transparent;color:var(--accent,#d4a03c);border:1px solid var(--accent,#d4a03c);padding:4px 12px;border-radius:6px;cursor:pointer;font-size:0.7rem;';
   resetBtn.onclick=function(){restoreSliders();};
   controlPanel.appendChild(addBtn);controlPanel.appendChild(resetBtn);document.body.appendChild(controlPanel);
  }else{
   sandboxBtn.style.background='';sandboxBtn.style.color='';sandboxBtn.style.borderRadius='';
   restoreSliders();
   if(controlPanel){controlPanel.remove();controlPanel=null;}
   document.querySelectorAll('.sandbox-custom-slider').forEach(function(el){el.remove();});
  }
 };
}
document.addEventListener('DOMContentLoaded',function(){try{initMorseEasterEgg();}catch(e){console.warn('Morse init:',e);}try{initDNAFingerprint();}catch(e){console.warn('DNA init:',e);}try{initSandboxMode();}catch(e){console.warn('Sandbox init:',e);}});



let currentLang = 'en';

function setLanguage(lang) {
  currentLang = lang;
  const s = LANG[lang];
  if (!s) return;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const k = el.dataset.i18n;
    if (s[k] != null) el.textContent = s[k];
  });
  document.querySelectorAll('[data-i18n-opt]').forEach(opt => {
    const k = opt.dataset.i18nOpt;
    if (s[k] != null) opt.textContent = s[k];
  });
  document.title = `${s.title} — Workshop DIY`;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;
  const sel = $('langSelect');
  if (sel) sel.value = lang;
  try { localStorage.setItem('wdiy-lang', lang); } catch {}
  log(s.langChanged, 'info');
}

/* ═══════ THEMES ═══════ */

function setTheme(name) {
  document.documentElement.dataset.theme = name;
  // Toggle shared .light-theme class
  document.documentElement.classList.toggle('light-theme', LIGHT_THEMES.includes(name));
  const sel = $('themeSelect');
  if (sel) sel.value = name;
  const s = LANG[currentLang];
  const label = s['t_' + name] || name;
  try { localStorage.setItem('wdiy-theme', name); } catch {}
  playThemeMelody(name);
  log(`${s.themeChanged} ${label}`, 'info');
}

/* ═══════ LOG ═══════ */

let logContainer;

function log(msg, type = 'info') {
  if (!logContainer) logContainer = $('logContainer');
  if (!logContainer) return;
  const d = document.createElement('div');
  d.className = `log-line ${type}`;
  const fullText = `[${new Date().toLocaleTimeString()}] ${msg}`;

  if (typewriterEnabled) {
    logContainer.appendChild(d);
    typewriterAppend(d, fullText);
  } else {
    d.textContent = fullText;
    logContainer.appendChild(d);
  }

  logContainer.scrollTop = logContainer.scrollHeight;
  if (type === 'success') { playSound('success'); pulseBismillah('success'); setPetState('happy'); }
  else if (type === 'error') { playSound('error'); pulseBismillah('error'); setPetState('sad'); }
  logWithHistory(msg, type);
  applyLogFilter();
  resetPetSleep();
}

function clearLog() {
  if (!logContainer) logContainer = $('logContainer');
  if (logContainer) logContainer.innerHTML = '';
  log(LANG[currentLang].logCleared);
}

async function copyLog() {
  if (!logContainer) logContainer = $('logContainer');
  if (!logContainer) return;
  const t = Array.from(logContainer.children).map(d => d.textContent).join('\n');
  try { await navigator.clipboard.writeText(t); log(LANG[currentLang].copied, 'success'); }
  catch { log(LANG[currentLang].copyFail, 'error'); }
}

/* ═══════ TOAST ═══════ */

let toastTimer = null;

function showToast(msg, autoHideMs = 0) {
  const el = $('toastIndicator'), t = $('toastMessage');
  if (el && t) {
    t.textContent = msg || LANG[currentLang].working;
    el.style.display = 'block';
  }
  if (toastTimer) clearTimeout(toastTimer);
  if (autoHideMs > 0) {
    toastTimer = setTimeout(hideToast, autoHideMs);
  }
}

function hideToast() {
  const el = $('toastIndicator');
  if (el) el.style.display = 'none';
  if (toastTimer) { clearTimeout(toastTimer); toastTimer = null; }
}

/* ═══════ STATUS ═══════ */

function setStatus(connected) {
  const pill = $('statusPill'), txt = $('statusText'), s = LANG[currentLang];
  if (txt) txt.textContent = connected ? s.connected : s.disconnected;
  if (pill) pill.classList.toggle('connected', connected);
}

/* ═══════ SPLASH ═══════ */

let splashTimer;

function dismissSplash() {
  const s = $('splash');
  if (!s) return;
  s.classList.add('hidden');
  if (splashTimer) clearTimeout(splashTimer);
  setTimeout(() => s.remove(), 600);
  playSound('click');
}

function initSplash() {
  const s = $('splash');
  if (!s) return;
  const sl = $('splashLogo');
  if (sl) sl.innerHTML = LOGO_SVG;
  splashTimer = setTimeout(dismissSplash, 2500);
}

/* ═══════ LOG FILTERS ═══════ */

let activeLogFilter = 'all';

function initLogFilters() {
  const filters = document.querySelectorAll('.log-filter');
  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeLogFilter = btn.dataset.filter;
      applyLogFilter();
      playSound('click');
    });
  });
}

function applyLogFilter() {
  if (!logContainer) logContainer = $('logContainer');
  if (!logContainer) return;
  Array.from(logContainer.children).forEach(line => {
    if (activeLogFilter === 'all') { line.style.display = ''; return; }
    line.style.display = line.classList.contains(activeLogFilter) ? '' : 'none';
  });
}

/* ═══════ EXPORT LOG ═══════ */

function exportLog() {
  if (!logContainer) logContainer = $('logContainer');
  if (!logContainer) return;
  const lines = Array.from(logContainer.children).map(d => d.textContent);
  const text = lines.join('\n');
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `log-${new Date().toISOString().slice(0,10)}.txt`;
  a.click();
  URL.revokeObjectURL(url);
  log(LANG[currentLang].copied, 'success');
  playSound('success');
}

/* ═══════ VERSION CHECKER ═══════ */

function checkVersion() {
  try {
    const stored = localStorage.getItem('wdiy-latest-version');
    if (stored && stored !== APP_VERSION) {
      // Show update badge on settings button
      const btn = $('settingsBtn');
      if (btn && !btn.querySelector('.version-update')) {
        const badge = document.createElement('span');
        badge.className = 'version-update';
        badge.textContent = LANG[currentLang].newVersion || 'UPDATE';
        btn.style.position = 'relative';
        badge.style.cssText = 'position:absolute;top:-6px;inset-inline-end:-6px;';
        btn.appendChild(badge);
      }
    }
  } catch {}
}

// Call this from your deployment/CI to set latest version:
// localStorage.setItem('wdiy-latest-version', '1.3');

/* ═══════ APP-TO-APP MESSAGING ═══════ */

const APP_MSG_KEY = 'wdiy-app-msg';

function sendAppMessage(type, data) {
  try {
    const msg = { type, data, from: document.title, ts: Date.now() };
    localStorage.setItem(APP_MSG_KEY, JSON.stringify(msg));
    localStorage.removeItem(APP_MSG_KEY); // triggers storage event on other tabs
  } catch {}
}

function onAppMessage(callback) {
  window.addEventListener('storage', e => {
    if (e.key !== APP_MSG_KEY || !e.newValue) return;
    try {
      const msg = JSON.parse(e.newValue);
      callback(msg);
    } catch {}
  });
}

/* ═══════ KONAMI CODE ═══════ */

const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let konamiIdx = 0;

function initKonami() {
  document.addEventListener('keydown', e => {
    if (e.key === KONAMI[konamiIdx]) {
      konamiIdx++;
      if (konamiIdx === KONAMI.length) {
        konamiIdx = 0;
        activateRetroTheme();
      }
    } else {
      konamiIdx = 0;
    }
  });
}

function activateRetroTheme() {
  setTheme('retro');
  log('🕹️ KONAMI CODE ACTIVATED — RETRO MODE!', 'success');
  playSound('success');
}

/* ═══════ BISMILLAH HEARTBEAT ═══════ */

function pulseBismillah(type) {
  const bism = document.querySelector('.bismillah');
  if (!bism) return;
  bism.classList.remove('pulse-success', 'pulse-error');
  void bism.offsetWidth; // force reflow
  bism.classList.add(type === 'error' ? 'pulse-error' : 'pulse-success');
  setTimeout(() => bism.classList.remove('pulse-success', 'pulse-error'), 700);
}

/* ═══════ MORSE CODE LOG ═══════ */

const MORSE = {
  'a':'.-','b':'-...','c':'-.-.','d':'-..','e':'.','f':'..-.','g':'--.','h':'....','i':'..','j':'.---',
  'k':'-.-','l':'.-..','m':'--','n':'-.','o':'---','p':'.--.','q':'--.-','r':'.-.','s':'...','t':'-',
  'u':'..-','v':'...-','w':'.--','x':'-..-','y':'-.--','z':'--..','0':'-----','1':'.----','2':'..---',
  '3':'...--','4':'....-','5':'.....','6':'-....','7':'--...','8':'---..','9':'----.',' ':'/'
};

let morseTimeout = null;
let morseActive = false;

function textToMorse(text) {
  return text.toLowerCase().split('').map(c => MORSE[c] || '').join(' ');
}

async function blinkMorse(text) {
  if (morseActive) return;
  morseActive = true;
  const dot = document.querySelector('.status-dot');
  if (!dot) { morseActive = false; return; }
  const orig = dot.style.background;
  const morse = textToMorse(text.replace(/\[.*?\]\s*/g, '')); // strip timestamp
  for (const ch of morse) {
    if (!morseActive) break;
    if (ch === '.') {
      dot.style.background = '#33ff33'; dot.style.boxShadow = '0 0 8px #33ff33';
      await sleep(100);
    } else if (ch === '-') {
      dot.style.background = '#33ff33'; dot.style.boxShadow = '0 0 8px #33ff33';
      await sleep(300);
    } else if (ch === '/') {
      await sleep(400);
      continue;
    } else if (ch === ' ') {
      await sleep(200);
      continue;
    }
    dot.style.background = orig; dot.style.boxShadow = '';
    await sleep(100);
  }
  dot.style.background = ''; dot.style.boxShadow = '';
  morseActive = false;
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function initMorseLog() {
  document.addEventListener('mousedown', e => {
    const line = e.target.closest('.log-line');
    if (!line) return;
    morseTimeout = setTimeout(() => blinkMorse(line.textContent), 600);
  });
  document.addEventListener('mouseup', () => {
    if (morseTimeout) { clearTimeout(morseTimeout); morseTimeout = null; }
  });
}

/* ═══════ MATRIX RAIN ═══════ */

let matrixRunning = false;
let matrixAnim = null;

const ARABIC_CHARS = 'بسمالرحنيوكلتعدفقثصضطظغشزخجذأؤئإءةىآ٠١٢٣٤٥٦٧٨٩';

function toggleMatrix() {
  const canvas = $('matrixCanvas');
  if (!canvas) return;
  if (matrixRunning) {
    matrixRunning = false;
    cancelAnimationFrame(matrixAnim);
    canvas.classList.remove('active');
    log('🔴 Matrix rain off', 'info');
    return;
  }
  matrixRunning = true;
  canvas.classList.add('active');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const cols = Math.floor(canvas.width / 16);
  const drops = Array(cols).fill(1);

  function draw() {
    if (!matrixRunning) return;
    ctx.fillStyle = 'rgba(0,0,0,0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#33ff33';
    ctx.font = '14px Amiri, serif';
    for (let i = 0; i < drops.length; i++) {
      const ch = ARABIC_CHARS[Math.floor(Math.random() * ARABIC_CHARS.length)];
      ctx.fillText(ch, i * 16, drops[i] * 16);
      if (drops[i] * 16 > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
    matrixAnim = requestAnimationFrame(draw);
  }
  draw();
  log('🟢 Matrix rain on!', 'success');
}

let logoClickCount = 0;
let logoClickTimer = null;

function initMatrixTrigger() {
  const logo = $('logoWrap');
  if (!logo) return;
  logo.style.cursor = 'pointer';
  logo.addEventListener('click', () => {
    logoClickCount++;
    if (logoClickTimer) clearTimeout(logoClickTimer);
    if (logoClickCount >= 3) {
      logoClickCount = 0;
      toggleMatrix();
    } else {
      logoClickTimer = setTimeout(() => logoClickCount = 0, 500);
    }
  });
}

/* ═══════ DEBUG PANEL (FPS + MEMORY) ═══════ */

function initDebug() {
  if (!new URLSearchParams(window.location.search).has('debug')) return;
  const panel = $('debugPanel');
  if (!panel) return;
  panel.classList.add('active');
  const fpsEl = $('debugFps'), memEl = $('debugMem');
  let frames = 0, lastTime = performance.now();

  function tick() {
    frames++;
    const now = performance.now();
    if (now - lastTime >= 1000) {
      if (fpsEl) fpsEl.textContent = frames + ' FPS';
      if (memEl && performance.memory) {
        memEl.textContent = (performance.memory.usedJSHeapSize / 1048576).toFixed(1) + ' MB';
      }
      frames = 0;
      lastTime = now;
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
  log('🐛 Debug mode active', 'info');
}

/* ═══════ SHAKE TO REPORT ═══════ */

function initShakeReport() {
  if (!window.DeviceMotionEvent) return;
  let lastShake = 0;
  const THRESHOLD = 25;

  window.addEventListener('devicemotion', e => {
    const acc = e.accelerationIncludingGravity;
    if (!acc) return;
    const force = Math.abs(acc.x) + Math.abs(acc.y) + Math.abs(acc.z);
    if (force > THRESHOLD && Date.now() - lastShake > 2000) {
      lastShake = Date.now();
      generateBugReport();
    }
  });
}

function generateBugReport() {
  if (!logContainer) logContainer = $('logContainer');
  const lines = logContainer ? Array.from(logContainer.children).map(d => d.textContent) : [];
  const report = {
    app: document.title,
    version: APP_VERSION,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    screen: `${screen.width}x${screen.height}`,
    viewport: `${innerWidth}x${innerHeight}`,
    theme: document.documentElement.dataset.theme,
    lang: currentLang,
    log: lines.slice(-50) // last 50 entries
  };
  const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `bug-report-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  log('📱 Bug report exported (shake)', 'success');
  playSound('success');
}

/* ═══════ TIME-TRAVEL LOG ═══════ */

const logHistory = [];

function logWithHistory(msg, type) {
  logHistory.push({ msg, type, ts: Date.now() });
}

// Time-travel: Ctrl+Z in log panel undoes last log entry
function initTimeTravel() {
  document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.key === 'z') {
      const panel = $('logPanel');
      if (!panel || !panel.classList.contains('open')) return;
      e.preventDefault();
      if (!logContainer) logContainer = $('logContainer');
      if (logContainer && logContainer.lastChild) {
        logContainer.removeChild(logContainer.lastChild);
        logHistory.pop();
        playSound('click');
      }
    }
  });
}

/* ═══════ TYPEWRITER LOG MODE ═══════ */

let typewriterEnabled = true;

async function typewriterAppend(element, text) {
  element.classList.add('typing');
  element.textContent = '';
  for (let i = 0; i < text.length; i++) {
    element.textContent += text[i];
    if (element.parentElement) element.parentElement.scrollTop = element.parentElement.scrollHeight;
    await sleep(12 + Math.random() * 18);
  }
  element.classList.remove('typing');
}

/* ═══════ HIJRI DATE ═══════ */

function calcHijriDate() {
  // Approximate Hijri conversion (Kuwaiti algorithm)
  const d = new Date();
  const jd = Math.floor((11 * d.getFullYear() + 3) / 30) + 354 * d.getFullYear() +
    30 * Math.floor((d.getMonth() + 1 - 1) / 2) + Math.floor(d.getDate() / 2) - 385;

  // Use Intl if available (much more accurate)
  try {
    const hijri = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
      day: 'numeric', month: 'long', year: 'numeric'
    }).format(d);
    return hijri;
  } catch {
    return '';
  }
}

function initHijriDate() {
  const el = $('hijriDate');
  if (!el) return;
  const h = calcHijriDate();
  if (h) el.textContent = h;
}

/* ═══════ WHISPER MODE (Voice-to-Log) ═══════ */

let recognition = null;
let whisperActive = false;

function toggleWhisper() {
  if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
    log('🎤 Speech not supported in this browser', 'error');
    return;
  }
  if (whisperActive) {
    if (recognition) recognition.stop();
    whisperActive = false;
    log('🎤 Whisper mode off', 'info');
    return;
  }
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SR();
  recognition.continuous = true;
  recognition.interimResults = false;
  recognition.lang = currentLang === 'ar' ? 'ar-DZ' : currentLang === 'fr' ? 'fr-FR' : 'en-US';

  recognition.onresult = e => {
    for (let i = e.resultIndex; i < e.results.length; i++) {
      if (e.results[i].isFinal) {
        const text = e.results[i][0].transcript.trim();
        if (text) log(`🎤 ${text}`, 'rx');
      }
    }
  };
  recognition.onerror = e => log(`🎤 Error: ${e.error}`, 'error');
  recognition.onend = () => { if (whisperActive) recognition.start(); };

  recognition.start();
  whisperActive = true;
  log('🎤 Whisper mode on — speak!', 'success');
}

/* ═══════ GHOST USERS (cross-tab cursors) ═══════ */

const GHOST_KEY = 'wdiy-ghost-cursor';
let ghostCanvas, ghostCtx;
let myGhostId = Math.random().toString(36).slice(2, 8);

function initGhostUsers() {
  ghostCanvas = document.createElement('canvas');
  ghostCanvas.className = 'ghost-canvas';
  ghostCanvas.style.cssText = 'position:fixed;inset:0;z-index:9998;pointer-events:none;';
  document.body.appendChild(ghostCanvas);
  ghostCtx = ghostCanvas.getContext('2d');
  ghostCanvas.width = innerWidth;
  ghostCanvas.height = innerHeight;

  window.addEventListener('resize', () => {
    ghostCanvas.width = innerWidth;
    ghostCanvas.height = innerHeight;
  });

  // Broadcast my cursor
  document.addEventListener('mousemove', e => {
    try {
      localStorage.setItem(GHOST_KEY, JSON.stringify({
        id: myGhostId, x: e.clientX, y: e.clientY, ts: Date.now()
      }));
    } catch {}
  });

  // Listen for other cursors
  const ghosts = {};
  window.addEventListener('storage', e => {
    if (e.key !== GHOST_KEY || !e.newValue) return;
    try {
      const d = JSON.parse(e.newValue);
      if (d.id === myGhostId) return;
      ghosts[d.id] = { x: d.x, y: d.y, ts: d.ts };
    } catch {}
  });

  // Render ghosts
  function drawGhosts() {
    ghostCtx.clearRect(0, 0, ghostCanvas.width, ghostCanvas.height);
    const now = Date.now();
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#d4a03c';
    for (const [id, g] of Object.entries(ghosts)) {
      if (now - g.ts > 3000) { delete ghosts[id]; continue; }
      const age = (now - g.ts) / 3000;
      ghostCtx.globalAlpha = 0.3 * (1 - age);
      ghostCtx.beginPath();
      ghostCtx.arc(g.x, g.y, 6, 0, Math.PI * 2);
      ghostCtx.fillStyle = accent;
      ghostCtx.fill();
      // tiny trail
      ghostCtx.beginPath();
      ghostCtx.arc(g.x, g.y, 3, 0, Math.PI * 2);
      ghostCtx.fillStyle = '#fff';
      ghostCtx.fill();
    }
    ghostCtx.globalAlpha = 1;
    requestAnimationFrame(drawGhosts);
  }
  requestAnimationFrame(drawGhosts);
}

/* ═══════ MUSICAL THEME SWITCHER ═══════ */

const THEME_MELODIES = {
  'mosque-gold': [330, 392, 523],    // E4 G4 C5 — majestic
  'zellige':     [440, 523, 659],    // A4 C5 E5 — bright
  'andalus':     [294, 370, 440],    // D4 F#4 A4 — warm
  'space':       [523, 659, 784],    // C5 E5 G5 — dreamy
  'jungle':      [262, 330, 392],    // C4 E4 G4 — earthy
  'robot':       [440, 554, 659],    // A4 C#5 E5 — techy
  'riad':        [349, 440, 523],    // F4 A4 C5 — serene
  'medina':      [294, 349, 440],    // D4 F4 A4 — calm
  'retro':       [523, 262, 523],    // C5 C4 C5 — retro beep
};

function playThemeMelody(themeName) {
  if (!soundEnabled) return;
  if (!audioCtx) audioCtx = new AudioCtx();
  const notes = THEME_MELODIES[themeName];
  if (!notes) return;
  const t = audioCtx.currentTime;
  notes.forEach((freq, i) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.value = 0.06;
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2 + i * 0.15 + 0.15);
    osc.start(t + i * 0.15);
    osc.stop(t + i * 0.15 + 0.2);
  });
}

/* ═══════ BREATHING GUIDE + DHIKR ═══════ */

let breathingActive = false;
let dhikrCount = 0;

function toggleBreathing() {
  const bands = document.querySelectorAll('.deco-band');
  breathingActive = !breathingActive;

  if (breathingActive) {
    bands.forEach(b => b.classList.add('breathing'));
    log('🫁 Breathing guide on — inhale... exhale...', 'info');
  } else {
    bands.forEach(b => b.classList.remove('breathing'));
    if (dhikrCount > 0) log(`📿 Dhikr count: ${dhikrCount}`, 'success');
    dhikrCount = 0;
    log('🫁 Breathing guide off', 'info');
  }
}

function incrementDhikr() {
  if (!breathingActive) return;
  dhikrCount++;
  playSound('click');
  const counter = $('dhikrCounter');
  if (counter) counter.textContent = dhikrCount;
}

/* ═══════ PIXEL PET (Animated Logo) ═══════ */

const PET_STATES = {
  idle:    { class: 'pet-idle', duration: 0 },
  happy:   { class: 'pet-happy', duration: 3000 },
  sad:     { class: 'pet-sad', duration: 3000 },
  sleep:   { class: 'pet-sleep', duration: 0 },
};

let petState = 'idle';
let petFrame = 0;
let petTimer = null;
let petIdleTimer = null;

function initPixelPet() {
  const pet = document.createElement('div');
  pet.id = 'pixelPet';
  pet.className = 'pixel-pet pet-idle';
  pet.title = 'Click me!';
  pet.innerHTML = `<img src="${FOOTER_ICON}" alt="Bot" />`;
  pet.addEventListener('click', () => {
    setPetState('happy');
    playSound('success');
  });
  const footer = document.querySelector('.app-footer');
  if (footer) footer.insertBefore(pet, footer.firstChild);
}

function setPetState(state) {
  petState = state;
  const pet = $('pixelPet');
  if (!pet) return;
  // Remove all state classes
  pet.classList.remove('pet-idle', 'pet-happy', 'pet-sad', 'pet-sleep');
  pet.classList.add(PET_STATES[state].class);
  // Auto-return to idle
  if (petIdleTimer) clearTimeout(petIdleTimer);
  const dur = PET_STATES[state].duration;
  if (dur > 0) {
    petIdleTimer = setTimeout(() => setPetState('idle'), dur);
  }
}

// Pet goes to sleep after 60s of no log activity
let petSleepTimer = null;
function resetPetSleep() {
  if (petSleepTimer) clearTimeout(petSleepTimer);
  if (petState === 'sleep') setPetState('idle');
  petSleepTimer = setTimeout(() => setPetState('sleep'), 60000);
}

/* ═══════ NIGHT MODE (sunset auto-detect) ═══════ */

function initNightMode() {
  // Calculate approximate sunset using date + rough estimate
  // More accurate with geolocation, but works without it
  const hour = new Date().getHours();
  const isNight = hour >= 21 || hour < 6;

  if (isNight) {
    // Only auto-apply if user hasn't manually set a theme
    try {
      const manual = localStorage.getItem('wdiy-theme');
      if (!manual) {
        setTheme('mosque-gold'); // calm dark theme
        log('🌙 Night mode — time to rest', 'info');
      }
    } catch {}
  }

  // Try geolocation for more precise sunset
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(pos => {
      const sunset = calcSunset(pos.coords.latitude, pos.coords.longitude);
      const now = new Date();
      const nowMins = now.getHours() * 60 + now.getMinutes();
      if (nowMins >= sunset || nowMins < 360) { // after sunset or before 6am
        try {
          const manual = localStorage.getItem('wdiy-theme');
          if (!manual) {
            setTheme('mosque-gold');
            log('🌙 Night detected — sweet dreams', 'info');
          }
        } catch {}
      }
    }, () => {}, { timeout: 3000 });
  }
}

function calcSunset(lat, lng) {
  // Simplified sunset calculation (returns minutes since midnight)
  const d = new Date();
  const N = Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 86400000);
  const radLat = lat * Math.PI / 180;
  const decl = -23.45 * Math.cos(2 * Math.PI / 365 * (N + 10)) * Math.PI / 180;
  const ha = Math.acos(-Math.tan(radLat) * Math.tan(decl)) * 180 / Math.PI;
  const sunset = 720 + (ha * 4) - (lng * 4) + (d.getTimezoneOffset());
  return Math.round(sunset);
}

/* ═══════ LOGO FOLLOWS CURSOR (magnetic eyes) ═══════ */

function initLogoTracker() {
  const logo = $('logoWrap');
  if (!logo) return;
  
  document.addEventListener('mousemove', e => {
    const rect = logo.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (innerWidth / 2);
    const dy = (e.clientY - cy) / (innerHeight / 2);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    const dist = Math.min(Math.sqrt(dx * dx + dy * dy), 1);
    
    const tiltX = dy * 8;  // max 8deg
    const tiltY = -dx * 8;
    const shift = dist * 4; // max 4px shift
    
    logo.style.transform = `perspective(200px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateX(${dx * shift}px) translateY(${dy * shift}px)`;
  });
  
  // Pupil dilate on click
  logo.addEventListener('mousedown', () => {
    logo.style.transition = 'transform .1s';
    logo.style.transform += ' scale(1.15)';
    setTimeout(() => { logo.style.transition = ''; }, 150);
  });
  logo.addEventListener('mouseup', () => {
    logo.style.transition = 'transform .2s';
    setTimeout(() => { logo.style.transition = ''; }, 200);
  });
  
  // Reset on mouse leave
  document.addEventListener('mouseleave', () => {
    logo.style.transition = 'transform .5s ease-out';
    logo.style.transform = '';
    setTimeout(() => { logo.style.transition = ''; }, 500);
  });
}

/* ═══════ MUSIC REACTIVE (live audio visualizer) ═══════ */

let musicAnalyser = null;
let musicActive = false;
let musicAnim = null;

function toggleMusicMode() {
  if (musicActive) {
    musicActive = false;
    if (musicAnim) cancelAnimationFrame(musicAnim);
    document.querySelectorAll('.deco-band').forEach(b => {
      b.style.height = ''; b.style.opacity = ''; b.style.background = '';
    });
    document.querySelectorAll('.card').forEach(c => c.style.transform = '');
    log('🎵 Music mode off', 'info');
    return;
  }
  
  navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
    if (!audioCtx) audioCtx = new AudioCtx();
    const source = audioCtx.createMediaStreamSource(stream);
    musicAnalyser = audioCtx.createAnalyser();
    musicAnalyser.fftSize = 256;
    source.connect(musicAnalyser);
    
    musicActive = true;
    log('🎵 Music mode on — play some music!', 'success');
    
    const data = new Uint8Array(musicAnalyser.frequencyBinCount);
    const bands = document.querySelectorAll('.deco-band');
    const cards = document.querySelectorAll('.card');
    const root = document.documentElement;
    
    function visualize() {
      if (!musicActive) return;
      musicAnalyser.getByteFrequencyData(data);
      
      // Average bass (0-10), mid (10-50), treble (50+)
      const bass = data.slice(0, 10).reduce((a, b) => a + b, 0) / 10 / 255;
      const mid = data.slice(10, 50).reduce((a, b) => a + b, 0) / 40 / 255;
      const treble = data.slice(50, 128).reduce((a, b) => a + b, 0) / 78 / 255;
      
      // Deco bands = live equalizer
      bands.forEach((b, i) => {
        const v = i === 0 ? bass : treble;
        b.style.height = (2 + v * 10) + 'px';
        b.style.opacity = 0.4 + v * 0.6;
      });
      
      // Cards pulse to bass
      cards.forEach(c => {
        c.style.transform = `scale(${1 + bass * 0.015})`;
        c.style.transition = 'transform 0.05s';
      });
      
      // Hue shift with frequency
      const hue = Math.round(mid * 60);
      root.style.filter = `hue-rotate(${hue}deg)`;
      
      musicAnim = requestAnimationFrame(visualize);
    }
    visualize();
  }).catch(() => {
    log('🎵 Microphone access denied', 'error');
  });
}

/* ═══════ AR MODE (WebXR overlay) ═══════ */

function initAR() {
  // Check WebXR support
  if (!navigator.xr) return;
  
  navigator.xr.isSessionSupported('immersive-ar').then(supported => {
    if (!supported) return;
    
    // Add AR button to header
    const btns = document.querySelector('.header-buttons');
    if (!btns) return;
    const arBtn = document.createElement('button');
    arBtn.className = 'btn-icon-only';
    arBtn.setAttribute('aria-label', 'AR Mode');
    arBtn.textContent = '📷';
    arBtn.onclick = startAR;
    btns.appendChild(arBtn);
    log('📷 AR mode available!', 'info');
  }).catch(() => {});
}

async function startAR() {
  try {
    const session = await navigator.xr.requestSession('immersive-ar', {
      requiredFeatures: ['hit-test'],
      optionalFeatures: ['dom-overlay'],
      domOverlay: { root: document.querySelector('.app') }
    });
    log('📷 AR session started!', 'success');
    
    session.addEventListener('end', () => {
      log('📷 AR session ended', 'info');
    });
  } catch (e) {
    log(`📷 AR failed: ${e.message}`, 'error');
  }
}

/* ═══════ AI CHAT (app talks back) ═══════ */

let chatHistory = [];

async function aiRespond(userMsg) {
  const s = LANG[currentLang];
  chatHistory.push({ role: 'user', content: userMsg });
  
  log(`💬 You: ${userMsg}`, 'tx');
  
  try {
    const systemPrompt = `You are the Workshop-DIY robot assistant embedded in a kids educational app. You are geeky, funny (clean humor), and helpful. Keep responses SHORT (1-2 sentences max). Current language: ${currentLang}. Current theme: ${document.documentElement.dataset.theme}. You know about MQTT, IoT, ESP32, micro:bit, and coding. You respect Islamic values. Never be mean. Be encouraging. Add relevant emojis.`;
    
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 150,
        system: systemPrompt,
        messages: chatHistory.slice(-10) // keep context short
      })
    });
    
    const data = await resp.json();
    const reply = data.content?.[0]?.text || '🤖 ...';
    chatHistory.push({ role: 'assistant', content: reply });
    log(`🤖 ${reply}`, 'rx');
    playSound('success');
    setPetState('happy');
  } catch (e) {
    log('🤖 Brain offline — check connection', 'error');
    setPetState('sad');
  }
}

function initAIChat() {
  // Add chat input to log panel footer
  const logFooter = document.querySelector('#logPanel .sidebar-footer');
  if (!logFooter) return;
  
  const chatRow = document.createElement('div');
  chatRow.className = 'chat-input-row';
  chatRow.innerHTML = `
    <input type="text" id="chatInput" class="chat-input" placeholder="Talk to the robot..." data-i18n-placeholder="chatPlaceholder" />
    <button id="chatSendBtn" class="btn-sm primary"><span class="btn-icon">🤖</span></button>
  `;
  logFooter.parentElement.insertBefore(chatRow, logFooter);
  
  const input = $('chatInput');
  const sendBtn = $('chatSendBtn');
  
  const send = () => {
    const msg = input.value.trim();
    if (!msg) return;
    input.value = '';
    aiRespond(msg);
  };
  
  if (sendBtn) sendBtn.onclick = send;
  if (input) input.addEventListener('keydown', e => {
    if (e.key === 'Enter') send();
  });
}

/* ═══════ LOG RESIZE ═══════ */

function initLogResize() {
  const handle = $('logResizeHandle');
  const panel = $('logPanel');
  if (!handle || !panel) return;

  let dragging = false;
  let startX, startW;
  const isRtl = () => document.documentElement.dir === 'rtl';

  handle.addEventListener('mousedown', e => {
    dragging = true;
    startX = e.clientX;
    startW = panel.offsetWidth;
    handle.classList.add('active');
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    e.preventDefault();
  });

  document.addEventListener('mousemove', e => {
    if (!dragging) return;
    const dx = isRtl() ? (e.clientX - startX) : (startX - e.clientX);
    const newW = Math.max(200, Math.min(startW + dx, window.innerWidth * 0.6));
    document.documentElement.style.setProperty('--log-width', newW + 'px');
  });

  document.addEventListener('mouseup', () => {
    if (!dragging) return;
    dragging = false;
    handle.classList.remove('active');
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    try {
      const w = getComputedStyle(document.documentElement).getPropertyValue('--log-width');
      localStorage.setItem('wdiy-log-width', w);
    } catch {}
  });

  // Touch support
  handle.addEventListener('touchstart', e => {
    dragging = true;
    startX = e.touches[0].clientX;
    startW = panel.offsetWidth;
    handle.classList.add('active');
    e.preventDefault();
  }, { passive: false });

  document.addEventListener('touchmove', e => {
    if (!dragging) return;
    const dx = isRtl() ? (e.touches[0].clientX - startX) : (startX - e.touches[0].clientX);
    const newW = Math.max(200, Math.min(startW + dx, window.innerWidth * 0.6));
    document.documentElement.style.setProperty('--log-width', newW + 'px');
  }, { passive: true });

  document.addEventListener('touchend', () => {
    if (!dragging) return;
    dragging = false;
    handle.classList.remove('active');
    try {
      const w = getComputedStyle(document.documentElement).getPropertyValue('--log-width');
      localStorage.setItem('wdiy-log-width', w);
    } catch {}
  });

  // Restore saved width
  try {
    const saved = localStorage.getItem('wdiy-log-width');
    if (saved) document.documentElement.style.setProperty('--log-width', saved);
  } catch {}
}

/* ═══════ PANELS ═══════ */

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

function openPanel(panelId, overlayId) {
  const sb = $(panelId), ov = $(overlayId);
  if (sb) sb.classList.add('open');
  if (ov) ov.classList.add('open');
  if (sb) {
    const first = sb.querySelector(FOCUSABLE);
    if (first) first.focus();
  }
}

function closePanel(panelId, overlayId, returnFocusId) {
  const sb = $(panelId), ov = $(overlayId);
  if (sb) sb.classList.remove('open');
  if (ov) ov.classList.remove('open');
  const btn = $(returnFocusId);
  if (btn) btn.focus();
}

function openHelp() { openPanel('helpPanel', 'helpOverlay'); }
function closeHelp() { closePanel('helpPanel', 'helpOverlay', 'helpBtn'); }
let logWasOpen = false;

function openSettings() {
  // If log is docked, remember and close it temporarily
  const logEl = $('logPanel');
  logWasOpen = logEl && logEl.classList.contains('open');
  if (logWasOpen) closeLog();
  openPanel('settingsPanel', 'settingsOverlay');
}
function closeSettings() {
  closePanel('settingsPanel', 'settingsOverlay', 'settingsBtn');
  // Restore log if it was open before
  if (logWasOpen) { openLog(); logWasOpen = false; }
}
function openLog() {
  const sb = $('logPanel');
  if (sb) sb.classList.add('open');
  document.body.classList.add('log-open');
}
function closeLog() {
  const sb = $('logPanel');
  if (sb) sb.classList.remove('open');
  document.body.classList.remove('log-open');
  const btn = $('logBtn');
  if (btn) btn.focus();
}

function toggleLog() {
  const sb = $('logPanel');
  if (sb && sb.classList.contains('open')) closeLog();
  else openLog();
}

function closeAllPanels() {
  closeHelp();
  closeSettings();
  closeLog();
}

function initHelpTabs() {
  const tabs = document.querySelectorAll('.help-tab');
  const contents = document.querySelectorAll('.help-content');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      const tabName = tab.dataset.tab;
      const targetId = 'help' + tabName.charAt(0).toUpperCase() + tabName.slice(1);
      const target = $(targetId);
      if (target) target.classList.add('active');
    });
  });
}

function trapFocus(e) {
  for (const id of ['helpPanel', 'settingsPanel', 'logPanel']) {
    const sb = $(id);
    if (!sb || !sb.classList.contains('open')) continue;
    const focusable = sb.querySelectorAll(FOCUSABLE);
    if (!focusable.length) return;
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
    return;
  }
}

/* ═══════ INIT ═══════ */

function init() {
  // Splash
  initSplash();

  // Inject logo
  const lw = $('logoWrap');
  if (lw) lw.innerHTML = LOGO_SVG;

  // Log buttons
  const cb = $('clearLogBtn'), cpb = $('copyLogBtn'), exb = $('exportLogBtn');
  if (cb) cb.onclick = clearLog;
  if (cpb) cpb.onclick = copyLog;
  if (exb) exb.onclick = exportLog;
  initLogFilters();

  // Help panel (left)
  const hBtn = $('helpBtn'), hClose = $('helpCloseBtn'), hOv = $('helpOverlay');
  if (hBtn) hBtn.onclick = openHelp;
  if (hClose) hClose.onclick = closeHelp;
  if (hOv) hOv.onclick = closeHelp;
  initHelpTabs();

  // Settings panel (right)
  const sBtn = $('settingsBtn'), sClose = $('settingsCloseBtn'), sOv = $('settingsOverlay');
  if (sBtn) sBtn.onclick = openSettings;
  if (sClose) sClose.onclick = closeSettings;
  if (sOv) sOv.onclick = closeSettings;

  // Log panel (right, docked)
  const lBtn = $('logBtn'), lClose = $('logCloseBtn');
  if (lBtn) lBtn.onclick = toggleLog;
  if (lClose) lClose.onclick = closeLog;
  initLogResize();

  // Sound toggle
  const soundTgl = $('soundToggle');
  if (soundTgl) {
    try { soundEnabled = localStorage.getItem('wdiy-sound') === 'true'; } catch {}
    soundTgl.checked = soundEnabled;
    soundTgl.addEventListener('change', () => {
      soundEnabled = soundTgl.checked;
      try { localStorage.setItem('wdiy-sound', soundEnabled); } catch {}
      if (soundEnabled) playSound('click');
    });
  }

  // Whisper mode
  const whisperBtn = $('whisperBtn');
  if (whisperBtn) whisperBtn.onclick = toggleWhisper;

  // Breathing guide + dhikr
  const breathBtn = $('breathingBtn');
  const dhikrDisp = $('dhikrDisplay');
  const dhikrBtn = $('dhikrBtn');
  if (breathBtn) breathBtn.onclick = () => {
    toggleBreathing();
    if (dhikrDisp) dhikrDisp.style.display = breathingActive ? 'flex' : 'none';
  };
  if (dhikrBtn) dhikrBtn.onclick = incrementDhikr;

  // Music mode
  const musicBtn = $('musicBtn');
  if (musicBtn) musicBtn.onclick = toggleMusicMode;

  // Escape key + focus trap
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeAllPanels();
    if (e.key === 'Tab') trapFocus(e);
  });

  // Language dropdown
  const langSel = $('langSelect');
  if (langSel) langSel.addEventListener('change', () => setLanguage(langSel.value));

  // Theme dropdown
  const themeSel = $('themeSelect');
  if (themeSel) themeSel.addEventListener('change', () => setTheme(themeSel.value));

  // Restore saved preferences
  try {
    const savedLang = localStorage.getItem('wdiy-lang');
    const savedTheme = localStorage.getItem('wdiy-theme');
    if (savedTheme) setTheme(savedTheme);
    if (savedLang) setLanguage(savedLang);
  } catch {}

  // Version check
  checkVersion();

  // App messaging listener
  onAppMessage(msg => {
    log(`📨 ${msg.from}: ${msg.type}`, 'rx');
  });

  // Geeky features
  initKonami();
  initMorseLog();
  initMatrixTrigger();
  initDebug();
  initShakeReport();
  initTimeTravel();
  initHijriDate();

  // Magic features
  initGhostUsers();
  initPixelPet();
  initNightMode();
  initLogoTracker();
  initAR();
  initAIChat();

  log(LANG[currentLang].ready, 'success');
}

document.readyState === 'loading'
  ? document.addEventListener('DOMContentLoaded', init)
  : init();


/* ═══════ APP-SPECIFIC i18n MERGE ═══════ */
Object.assign(LANG.en, {"title": "Propagation Monitor", "subtitle": "🌍 Beacons and solar data propagation monitor", "sectionA": "Theory", "sectionB": "Controls", "sectionC": "Simulation", "mainSection": "Propagation Monitor", "mainDesc": "Beacons and solar data propagation monitor", "start": "Start", "stop": "Stop", "simStarted": "Simulation started", "simStopped": "Simulation stopped", "theoryTitle": "Propagation Monitor Theory", "theoryDesc": "Beacons and solar data propagation monitor"});
Object.assign(LANG.fr, {"title": "Moniteur de Propagation", "subtitle": "🌍 Moniteur balises et données solaires", "sectionA": "Théorie", "sectionB": "Contrôles", "sectionC": "Simulation", "mainSection": "Moniteur de Propagation", "mainDesc": "Moniteur balises et données solaires", "start": "Démarrer", "stop": "Arrêter", "simStarted": "Simulation démarrée", "simStopped": "Simulation arrêtée", "theoryTitle": "Théorie Moniteur de Propagation", "theoryDesc": "Moniteur balises et données solaires"});
Object.assign(LANG.ar, {"title": "راصد الانتشار", "subtitle": "🌍 راصد المنارات وبيانات شمسية", "sectionA": "النظرية", "sectionB": "أدوات التحكم", "sectionC": "المحاكاة", "mainSection": "راصد الانتشار", "mainDesc": "راصد المنارات وبيانات شمسية", "start": "بدء", "stop": "إيقاف", "simStarted": "بدأت المحاكاة", "simStopped": "توقفت المحاكاة", "theoryTitle": "نظرية راصد الانتشار", "theoryDesc": "راصد المنارات وبيانات شمسية"});
// Re-apply current language to pick up new keys
setLanguage(currentLang);


/* ═══════ PROPAGATION MONITOR SIM ═══════ */
let simRunning=false,simTimer=null;
const propC=$('propCanvas'),propCtx=propC?propC.getContext('2d'):null;
let sfiHistory=[],aHistory=[];

function updateSolar(){
  const sfi=60+Math.floor(Math.random()*140);
  const a=Math.floor(Math.random()*30);
  const k=Math.floor(Math.random()*9);
  const sE=$('sfiValue'),aE=$('aValue'),kE=$('kValue');
  if(sE)sE.textContent=sfi;if(aE)aE.textContent=a;if(kE)kE.textContent=k;
  sfiHistory.push(sfi);aHistory.push(a);
  if(sfiHistory.length>100)sfiHistory.shift();
  if(aHistory.length>100)aHistory.shift();
  // Band conditions
  const bc=$('bandConditions');
  if(bc){bc.innerHTML='';
    ['160m','80m','40m','20m','15m','10m'].forEach(b=>{
      const good=sfi>100&&a<15;const fair=sfi>80;
      const color=good?'#4ade80':fair?'#fbbf24':'#f87171';
      const d=document.createElement('div');d.style.cssText='padding:4px;border-radius:4px;font-size:.75rem;text-align:center;background:'+color+'22;color:'+color+';border:1px solid '+color+'44';
      d.textContent=b+(good?' ✔':fair?' ~':' ✘');bc.appendChild(d);
    });}
  // Beacon
  const bl=$('beaconList');
  if(bl){const call='4U1UN 14.100 '+sfi+'SFI';const d=document.createElement('div');d.textContent=new Date().toLocaleTimeString()+' '+call;bl.appendChild(d);bl.scrollTop=bl.scrollHeight;}
  // Graph
  if(propCtx){
    const W=propC.width,H=propC.height;
    propCtx.fillStyle='rgba(0,0,0,0.05)';propCtx.fillRect(0,0,W,H);
    propCtx.strokeStyle=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
    propCtx.lineWidth=1.5;propCtx.beginPath();
    sfiHistory.forEach((v,i)=>{const x=i/100*W;const y=H-(v/200)*H;i===0?propCtx.moveTo(x,y):propCtx.lineTo(x,y);});
    propCtx.stroke();
    propCtx.strokeStyle=getComputedStyle(document.documentElement).getPropertyValue('--accent2').trim()||'#0ea5e9';
    propCtx.beginPath();
    aHistory.forEach((v,i)=>{const x=i/100*W;const y=H-(v/30)*H;i===0?propCtx.moveTo(x,y):propCtx.lineTo(x,y);});
    propCtx.stroke();
  }
  log('Solar: SFI='+sfi+' A='+a+' K='+k,'info');
}

function startSim(){if(simRunning)return;simRunning=true;setStatus(true);
  log(LANG[currentLang].simStarted||'Started','success');
  updateSolar();simTimer=setInterval(updateSolar,5000);}
function stopSim(){simRunning=false;if(simTimer)clearInterval(simTimer);setStatus(false);
  log(LANG[currentLang].simStopped||'Stopped','info');}
function init_propagation_monitor(){
  if($('startBtn'))$('startBtn').onclick=startSim;
  if($('stopBtn'))$('stopBtn').onclick=stopSim;
}
init_propagation_monitor();

/* ═══════ INIT POMODORO + CARD FLIP ═══════ */
document.addEventListener('DOMContentLoaded', function(){
  try { initPomodoro(); } catch(e) { console.warn('Pomodoro init error:', e); }
  try { initCardFlip(); } catch(e) { console.warn('CardFlip init error:', e); }
});
